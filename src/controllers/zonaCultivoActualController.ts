import { Request, Response } from 'express';
import { ZonaCultivoActual } from '../models/ZonaCultivoActual';
import { GestionCultivo } from '../models/gestionarCultivos';

export class zonaCultivoActualController {
  static EstadoTiempoReal = async (req: Request, res: Response) => {
    try {
      const id_zona = Number(req.params.id_zona);

      if (isNaN(id_zona)) {
        res.status(400).json({ error: 'El ID de zona debe ser un número válido' });
      }

      const cultivoActual = await ZonaCultivoActual.findOne({
        where: { id_zona },
        include: [
          {
            model: GestionCultivo,
            as: 'cultivo', 
          },
        ],
      });

      if (!cultivoActual) {
        res.status(404).json({ error: 'No hay cultivo actual para esta zona' });
      return;
    }

      res.json({
        id_zona: cultivoActual.id_zona,
        cultivo: cultivoActual.cultivo,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener estado en tiempo real',
        details: error,
      });
    }
  };
}
