"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zonaCultivoActualController = void 0;
const ZonaCultivoActual_1 = require("../models/ZonaCultivoActual");
const gestionarCultivos_1 = require("../models/gestionarCultivos");
class zonaCultivoActualController {
    static EstadoTiempoReal = async (req, res) => {
        try {
            const id_zona = Number(req.params.id_zona);
            if (isNaN(id_zona)) {
                res.status(400).json({ error: 'El ID de zona debe ser un número válido' });
            }
            const cultivoActual = await ZonaCultivoActual_1.ZonaCultivoActual.findOne({
                where: { id_zona },
                include: [
                    {
                        model: gestionarCultivos_1.GestionCultivo,
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
        }
        catch (error) {
            res.status(500).json({
                error: 'Error al obtener estado en tiempo real',
                details: error,
            });
        }
    };
}
exports.zonaCultivoActualController = zonaCultivoActualController;
//# sourceMappingURL=zonaCultivoActualController.js.map