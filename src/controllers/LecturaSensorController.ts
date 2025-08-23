import { Request, Response, NextFunction } from "express";
import LecturaSensor from "../models/lecturaSensor";
import Zona from "../models/zona";
import GestionCultivo from "../models/gestionarCultivos";
import { io } from "../server"; // Instancia de Socket.IO

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
    // Guardar lectura en la base de datos
    const lectura = await LecturaSensor.create({
      id_sensor,
      valor,
      unidad: unidad || null,
      id_zona: id_zona || null,
    });

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

        if (tipo_sensor === "humedad" || !tipo_sensor) {
          alerta = valor < humedad_min || valor > humedad_max ? "Fuera de rango" : "Dentro de rango";
        }
      }
    }

    // Emitir lectura para frontend
    const lecturaEmitida = {
      id: lectura.id,
      id_zona,
      tipo_sensor: tipo_sensor || "humedad",
      valor,
      unidad,
      alerta,
      min: humedad_min ?? 40,  // para la gráfica
      max: humedad_max ?? 70,  // para la gráfica
      timestamp: new Date(),
    };

    io.emit("nuevaLectura", lecturaEmitida);

    return res.status(201).json(lecturaEmitida);

  } catch (error) {
    console.error("❌ Error en registrarLectura:", error);
    next(error);
  }
};
