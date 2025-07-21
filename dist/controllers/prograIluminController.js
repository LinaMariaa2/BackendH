"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrograIluminController = void 0;
const sequelize_1 = require("sequelize");
const programacionIluminacion_1 = __importDefault(require("../models/programacionIluminacion"));
const zona_1 = __importDefault(require("../models/zona"));
class PrograIluminController {
    static getTodasLasProgramaciones = async (_req, res) => {
        try {
            const datos = await programacionIluminacion_1.default.findAll();
            res.json(datos);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener las programaciones', details: error });
        }
    };
    static getProgramacionPorId = async (req, res) => {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ mensaje: 'ID inválido' });
            return;
        }
        try {
            const dato = await programacionIluminacion_1.default.findByPk(id);
            if (dato) {
                res.json(dato);
            }
            else {
                res.status(404).json({ mensaje: 'Programación no encontrada' });
            }
        }
        catch (error) {
            res.status(500).json({ error: 'Error al buscar la programación', details: error });
        }
    };
    static crearProgramacion = async (req, res) => {
        try {
            const nueva = await programacionIluminacion_1.default.create(req.body);
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
            const programacion = await programacionIluminacion_1.default.findByPk(id);
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
            const eliminado = await programacionIluminacion_1.default.destroy({ where: { id_iluminacion: id } });
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
    static getZonasActivasParaESP32 = async (_req, res) => {
        try {
            const ahora = new Date();
            // Consultar programaciones activas con JOIN a la tabla Zona
            const programaciones = await programacionIluminacion_1.default.findAll({
                where: {
                    fecha_inicio: { [sequelize_1.Op.lte]: ahora },
                    fecha_finalizacion: { [sequelize_1.Op.gte]: ahora }
                },
                include: [
                    {
                        model: zona_1.default,
                        where: { estado: 'activo' }, // Solo zonas activas
                        attributes: ['id_zona', 'estado']
                    }
                ]
            });
            //console.log('🕒 Fecha y hora actual:', ahora.toISOString());
            //console.log('📦 Programaciones activas con zona activa:', programaciones.length);
            programaciones.forEach(p => {
                console.log(`🧾 Zona: ${p.id_zona} | Inicio: ${p.fecha_inicio?.toISOString()} | Fin: ${p.fecha_finalizacion?.toISOString()}`);
            });
            const zonasActivadas = {};
            for (let i = 1; i <= 3; i++) {
                zonasActivadas[i.toString()] = false;
            }
            programaciones.forEach(p => {
                if (p.id_zona && zonasActivadas[p.id_zona.toString()] !== undefined) {
                    zonasActivadas[p.id_zona.toString()] = true;
                }
            });
            res.json(zonasActivadas);
        }
        catch (error) {
            res.status(500).json({
                error: 'Error al obtener zonas activas',
                detalle: error.message || error
            });
        }
    };
}
exports.PrograIluminController = PrograIluminController;
//# sourceMappingURL=prograIluminController.js.map