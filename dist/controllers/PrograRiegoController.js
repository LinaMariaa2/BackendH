"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrograRiegoController = void 0;
const sequelize_1 = require("sequelize");
const programacionRiego_1 = __importDefault(require("../models/programacionRiego"));
const zona_1 = __importDefault(require("../models/zona"));
class PrograRiegoController {
    static getTodasLasProgramaciones = async (_req, res) => {
        try {
            const datos = await programacionRiego_1.default.findAll();
            res.json(datos);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener las programaciones', detalle: error });
        }
    };
    static getProgramacionPorId = async (req, res) => {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ mensaje: 'ID inválido' });
            return;
        }
        try {
            const dato = await programacionRiego_1.default.findByPk(id);
            if (dato) {
                res.json(dato);
            }
            else {
                res.status(404).json({ mensaje: 'Programación no encontrada' });
            }
        }
        catch (error) {
            res.status(500).json({ error: 'Error al buscar la programación', detalle: error });
        }
    };
    static crearProgramacion = async (req, res) => {
        try {
            const nueva = await programacionRiego_1.default.create(req.body);
            res.status(201).json(nueva);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al crear la programación', detalle: error });
        }
    };
    static actualizarProgramacion = async (req, res) => {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ mensaje: 'ID inválido' });
            return;
        }
        try {
            const programacion = await programacionRiego_1.default.findByPk(id);
            if (!programacion) {
                res.status(404).json({ mensaje: 'Programación no encontrada' });
                return;
            }
            await programacion.update(req.body);
            res.json({ mensaje: 'Programación actualizada correctamente', programacion });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al actualizar la programación', detalle: error });
        }
    };
    static eliminarProgramacion = async (req, res) => {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ mensaje: 'ID inválido' });
            return;
        }
        try {
            const eliminado = await programacionRiego_1.default.destroy({ where: { id_pg_riego: id } });
            if (eliminado) {
                res.json({ mensaje: 'Programación eliminada correctamente' });
            }
            else {
                res.status(404).json({ mensaje: 'Programación no encontrada' });
            }
        }
        catch (error) {
            res.status(500).json({ error: 'Error al eliminar la programación', detalle: error });
        }
    };
    static getZonasRiegoActivasParaESP32 = async (_req, res) => {
        try {
            const ahora = new Date();
            const programaciones = await programacionRiego_1.default.findAll({
                where: {
                    fecha_inicio: { [sequelize_1.Op.lte]: ahora },
                    fecha_finalizacion: { [sequelize_1.Op.gte]: ahora }
                },
                include: [zona_1.default]
            });
            const zonasActivadas = {};
            for (let i = 1; i <= 3; i++) {
                zonasActivadas[i.toString()] = false;
            }
            programaciones.forEach((p) => {
                const zonaId = p.id_zona?.toString();
                let tipo = typeof p.tipo_riego === 'string' ? p.tipo_riego.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : null;
                if (zonaId &&
                    (tipo === 'goteo' || tipo === 'aspersion') &&
                    zonasActivadas[zonaId] !== undefined) {
                    zonasActivadas[zonaId] = tipo;
                }
            });
            res.json(zonasActivadas);
        }
        catch (error) {
            res.status(500).json({
                error: 'Error al obtener zonas activas de riego',
                detalle: error.message || error
            });
        }
    };
}
exports.PrograRiegoController = PrograRiegoController;
//# sourceMappingURL=PrograRiegoController.js.map