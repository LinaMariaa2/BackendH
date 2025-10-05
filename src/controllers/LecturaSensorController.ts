import { Request, Response, NextFunction } from "express";
import LecturaSensor from "../models/lecturaSensor";
import Zona from "../models/zona";
import GestionCultivo from "../models/gestionarCultivos";
import Notificacion from "../models/notificacion";
import { PrograRiegoController } from "./prograRiegoController";
import { io } from "../server"; // Instancia de Socket.IO


// 🕒 Registro del último guardado por sensor/zona
const lastSavedAt: Record<string, number> = {};
// Estado de alerta por zona (memoria)
const alertaActivaPorZona: Record<number, boolean> = {};


export const registrarLectura = async (req: Request, res: Response, next: NextFunction) => {
  console.log("DEBUG req.body:", req.body);

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "No se recibió ningún dato" });
  }

  const { id_sensor, valor, unidad, id_zona, tipo_sensor } = req.body;

  if (id_sensor === undefined || valor === undefined) {
    return res
      .status(400)
      .json({ error: "Faltan campos obligatorios: id_sensor o valor" });
  }

  try {
    let alerta: string | null = null;
    let humedad_min: number | null = null;
    let humedad_max: number | null = null;

    // Si la lectura es de humedad, obtener los rangos de la zona/cultivo
    if (id_zona) {
      const zona = await Zona.findByPk(id_zona, {
        include: [{ model: GestionCultivo }],
      });

      if (zona && zona.cultivo) {
        humedad_min = zona.cultivo.humedad_min ?? 40;
        humedad_max = zona.cultivo.humedad_max ?? 70;

        // ... dentro de registrarLectura, justo donde evalúas humedad
        if (tipo_sensor === "humedad" || !tipo_sensor) {
  const zonaInfo = await Zona.findByPk(id_zona);
  const zonaNombre = zonaInfo ? zonaInfo.nombre : "Zona desconocida";

  if (valor < humedad_min) {
    alerta = "Humedad baja";

    // Solo emitir si no estaba activa la alerta
    if (!alertaActivaPorZona[id_zona]) {
      alertaActivaPorZona[id_zona] = true;

      await PrograRiegoController.activarRiegoAutomatico(Number(id_zona));

      const notificacion = await Notificacion.create({
        tipo: "alerta_sensor",
        titulo: `Alerta en ${zonaNombre}`,
        mensaje: `La humedad (${valor}%) está por DEBAJO del rango (${humedad_min}–${humedad_max}%). Activando riego automático...`,
        leida: false,
      });

      const notificacionConCreatedAt = {
        ...notificacion.toJSON(),
        createdAt: notificacion.timestamp,
      };

      io.to("operario").emit("nuevaNotificacion", notificacionConCreatedAt);

    }

  } else if (valor > humedad_max) {
    alerta = "Humedad alta";

    if (!alertaActivaPorZona[id_zona]) {
      alertaActivaPorZona[id_zona] = true;

      await PrograRiegoController.detenerRiegoAutomatico(Number(id_zona));

      const notificacion = await Notificacion.create({
        tipo: "alerta_sensor",
        titulo: `Alerta en ${zonaNombre}`,
        mensaje: `La humedad (${valor}%) está por ENCIMA del rango (${humedad_min}–${humedad_max}%).`,
        leida: false,
      });

      const notificacionConCreatedAt = {
        ...notificacion.toJSON(),
        createdAt: notificacion.timestamp,
      };

      io.to("operario").emit("nuevaNotificacion", notificacionConCreatedAt);

    }

  } else {
    alerta = "Dentro de rango";

    // Solo emitir si antes había alerta activa
    if (alertaActivaPorZona[id_zona]) {
      alertaActivaPorZona[id_zona] = false;

      await PrograRiegoController.detenerRiegoAutomatico(Number(id_zona));

      const notificacion = await Notificacion.create({
        tipo: "info_sensor",
        titulo: `Zona ${zonaNombre}`,
        mensaje: `La humedad (${valor}%) volvió a estar dentro del rango (${humedad_min}–${humedad_max}%).`,
        leida: false,
      });

      const notificacionConCreatedAt = {
        ...notificacion.toJSON(),
        createdAt: notificacion.timestamp,
      };

      io.to("operario").emit("nuevaNotificacion", notificacionConCreatedAt);

    }
  }
}


    }
  }

    // 🔹 Emitir SIEMPRE al frontend
    const lecturaEmitida: any = {
      id_sensor,
      id_zona,
      tipo_sensor: tipo_sensor || "humedad",
      valor,
      unidad,
      alerta,
      min: humedad_min ?? 40, // para la gráfica
      max: humedad_max ?? 70, // para la gráfica
      timestamp: new Date(),
    };

    io.emit("nuevaLectura", lecturaEmitida);

    // 🔹 Guardar en DB solo cada 20 minutos por sensor/zona
    const key = `${id_sensor}-${id_zona}`;
    const ahora = Date.now();

    if (!lastSavedAt[key] || ahora - lastSavedAt[key] >= 15 * 60 * 1000) {
      const lectura = await LecturaSensor.create({
        id_sensor,
        valor,
        unidad: unidad || null,
        id_zona: id_zona || null,
      });

      lastSavedAt[key] = ahora;
      lecturaEmitida.id = lectura.id; // solo si se guardó en DB
      console.log(`💾 Lectura guardada en DB (${key})`);
    } else {
      console.log(`⚡ Lectura NO guardada en DB (${key}), solo emitida`);
    }

    return res.status(201).json(lecturaEmitida);

  } catch (error) {
    console.error("❌ Error en registrarLectura:", error);
    next(error);
  }
};

//  controlador para el DHT11 
export const registrarLecturaDHT11 = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { temperatura, humedad } = req.body;

    if (temperatura === undefined && humedad === undefined) {
      return res.status(400).json({ error: "Se requiere al menos temperatura o humedad" });
    }

    const lecturaDHT11: any = {
      tipo: "dht11",
      temperatura: temperatura ?? null,
      humedad: humedad ?? null,
      unidadTemp: "°C",
      unidadHum: "%",
      timestamp: new Date(),
    };

    const ahora = Date.now();

    //  Guardar temperatura en DB cada 20 min
    if (temperatura !== undefined) {
      const keyTemp = `dht11-temp`;
      if (!lastSavedAt[keyTemp] || ahora - lastSavedAt[keyTemp] >= 15 * 60 * 1000) {
        await LecturaSensor.create({
          id_sensor: 2, // 🔧 id fijo para temperatura del DHT11
          valor: temperatura,
          unidad: "°C",
          id_zona: null,
        });
        lastSavedAt[keyTemp] = ahora;
        console.log("💾 Temperatura DHT11 guardada en DB");
      } else {
        console.log("⚡ Temperatura DHT11 no guardada (menos de 30 min)");
      }
    }

    //  Guardar humedad en DB cada 20 min
    if (humedad !== undefined) {
      const keyHum = `dht11-hum`;
      if (!lastSavedAt[keyHum] || ahora - lastSavedAt[keyHum] >= 15 * 60 * 1000) {
        await LecturaSensor.create({
          id_sensor: 3, // 🔧 id fijo para humedad del DHT11
          valor: humedad,
          unidad: "%",
          id_zona: null,
        });
        lastSavedAt[keyHum] = ahora;
        console.log("💾 Humedad DHT11 guardada en DB");
      } else {
        console.log("⚡ Humedad DHT11 no guardada (menos de 30 min)");
      }
    }

    // Emitir SOLO al canal del DHT11
    io.emit("nuevaLecturaDHT11", lecturaDHT11);

    console.log("📡 Lectura DHT11 emitida:", lecturaDHT11);

    return res.status(201).json(lecturaDHT11);

  } catch (error) {
    console.error("❌ Error en registrarLecturaDHT11:", error);
    next(error);
  }
};
