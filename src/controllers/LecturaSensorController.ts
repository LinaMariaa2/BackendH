import { Request, Response, NextFunction } from "express";
import LecturaSensor from "../models/lecturaSensor";
import Zona from "../models/zona";
import GestionCultivo from "../models/gestionarCultivos";
import { io } from "../server";
//INICIO: CÓDIGO AGREGADO
import { sendNotification } from "../services/notificationesService"; // 1. Se agrega el import

// Objeto para regular el envío de notificaciones y evitar spam
const lastNotificationSent: Record<string, number> = {};
//FIN: CÓDIGO AGREGADO

// 🕒 Registro del último guardado por sensor/zona
const lastSavedAt: Record<string, number> = {};

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
    let responsable_id: number | null = null; // Para guardar el ID del responsable
    let nombre_cultivo: string | null = null; // Para guardar el nombre del cultivo

    // Si la lectura es de humedad, obtener los rangos de la zona/cultivo
    if (id_zona) {
      const zona = await Zona.findByPk(id_zona, {
        include: [{ model: GestionCultivo }],
      });

      if (zona && zona.cultivo) {
        humedad_min = zona.cultivo.humedad_min ?? 40;
        humedad_max = zona.cultivo.humedad_max ?? 70;
        // Se guardan los datos del cultivo para usarlos después
        responsable_id = zona.cultivo.responsable_id;
        nombre_cultivo = zona.cultivo.nombre_cultivo;

        if (tipo_sensor === "humedad" || !tipo_sensor) {
          alerta =
            valor < humedad_min || valor > humedad_max
              ? "Fuera de rango"
              : "Dentro de rango";
        }
      }
    }
    
    // INICIO: CÓDIGO DE NOTIFICACIONES AGREGADO ---
    // 2. Se agrega el bloque que envía la notificación si hay una alerta
    if (alerta === "Fuera de rango" && responsable_id && nombre_cultivo) {
      const notificationKey = `alerta-${id_zona}-${tipo_sensor}`;
      const ahora = Date.now();
      
      // Lógica Anti-Spam: Solo enviar si han pasado +30 min desde la última alerta
      if (!lastNotificationSent[notificationKey] || ahora - lastNotificationSent[notificationKey] > 30 * 60 * 1000) {
        const titulo = '💧 Alerta de Humedad';
        const mensaje = `El cultivo '${nombre_cultivo}' está fuera de rango. Humedad actual: ${valor}%.`;
        
        sendNotification(responsable_id, titulo, mensaje);
        
        lastNotificationSent[notificationKey] = ahora; // Se actualiza el tiempo
      }
    }
    //FIN: CÓDIGO DE NOTIFICACIONES AGREGADO ---

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

    // 🔹 Guardar en DB solo cada 30 minutos por sensor/zona
    const key = `${id_sensor}-${id_zona}`;
    const ahora = Date.now();

    if (!lastSavedAt[key] || ahora - lastSavedAt[key] >= 30 * 60 * 1000) {
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