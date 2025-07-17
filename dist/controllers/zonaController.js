"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zonaController = void 0;
const zona_1 = __importDefault(require("../models/zona"));
const actualizarConteoZona_1 = require("../helpers/actualizarConteoZona");
const invernadero_1 = require("../models/invernadero");
class zonaController {
    static getAll = async (_req, res) => {
        try {
            const zonas = await zona_1.default.findAll({ order: [['id_zona', 'ASC']] });
            res.json(zonas);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener las zonas', details: error });
        }
    };
    static getAllActivos = async (_req, res) => {
        try {
            const zona = await zona_1.default.findAll({
                where: { estado: 'activo' },
                order: [['id_zona', 'ASC']],
            });
            res.json(zona);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener todos las zonas', details: error });
        }
    };
    static getZonasPorInvernadero = async (req, res) => {
        const { id } = req.params;
        try {
            const zonas = await zona_1.default.findAll({ where: { id_invernadero: id } });
            res.json(zonas);
        }
        catch (error) {
            res.status(500).json({ message: 'Error al obtener zonas del invernadero', error });
        }
    };
    static crearZona = async (req, res) => {
        try {
            const { nombre, descripciones_add, estado, id_cultivo, id_invernadero } = req.body;
            // Validar que el invernadero exista y esté activo
            const invernadero = await invernadero_1.Invernadero.findByPk(id_invernadero);
            if (!invernadero) {
                res.status(404).json({ error: 'Invernadero no encontrado' });
                return;
            }
            if (invernadero.estado !== 'activo') {
                res.status(400).json({
                    error: `No se puede crear la zona porque el invernadero está en estado: "${invernadero.estado}".`,
                });
                return;
            }
            const zona = await zona_1.default.create({
                nombre,
                descripciones_add,
                estado,
                id_cultivo: id_cultivo || null,
                id_invernadero,
            });
            await (0, actualizarConteoZona_1.actualizarConteoZonas)(zona.id_invernadero);
            res.status(201).json({ mensaje: 'Zona creada correctamente', zona });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al crear la zona', details: error });
        }
    };
    static actualizarZona = async (req, res) => {
        try {
            const { id_zona } = req.params;
            const { nombre, descripciones_add, estado, id_cultivo, id_invernadero } = req.body;
            const [updated] = await zona_1.default.update({
                nombre,
                descripciones_add,
                estado,
                id_cultivo: id_cultivo || null,
                id_invernadero,
            }, {
                where: { id_zona },
            });
            if (updated === 0) {
                res.status(404).json({ error: 'Zona no encontrada' });
                return;
            }
            const zonaActualizada = await zona_1.default.findByPk(id_zona);
            if (zonaActualizada) {
                await (0, actualizarConteoZona_1.actualizarConteoZonas)(zonaActualizada.id_invernadero);
            }
            res.json({ mensaje: 'Zona actualizada correctamente' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al actualizar la zona', details: error });
        }
    };
    static cambiarEstadoGenerico = async (req, res) => {
        const { id_zona } = req.params;
        const { estado } = req.body;
        const estadosPermitidos = ['activo', 'inactivo', 'mantenimiento'];
        if (!estadosPermitidos.includes(estado)) {
            res.status(400).json({ error: 'Estado no válido' });
            return;
        }
        const zona = await zona_1.default.findByPk(id_zona);
        if (!zona) {
            res.status(404).json({ error: 'Zona no encontrada' });
            return;
        }
        // 🔒 Verifica el estado del invernadero al que pertenece
        const invernadero = await invernadero_1.Invernadero.findByPk(zona.id_invernadero);
        if (!invernadero) {
            res.status(404).json({ error: 'Invernadero no encontrado' });
            return;
        }
        if (invernadero.estado !== 'activo') {
            res.status(400).json({
                error: `No se puede cambiar el estado de una zona porque su invernadero está en estado: "${invernadero.estado}".`,
            });
        }
        zona.estado = estado;
        await zona.save({ fields: ['estado'] });
        res.json({ mensaje: 'Estado de la zona actualizado correctamente', zona });
        return;
    };
    static inactivarZona = async (req, res) => {
        try {
            const { id_zona } = req.params;
            const zona = await zona_1.default.findByPk(id_zona);
            if (!zona) {
                res.status(404).json({ error: 'Zona no encontrada' });
                return;
            }
            zona.set('estado', 'inactivo');
            await zona.save({ fields: ['estado'] });
            await (0, actualizarConteoZona_1.actualizarConteoZonas)(zona.id_invernadero);
            res.json({ mensaje: 'Zona inactivada correctamente' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al inactivar la zona', details: error });
        }
    };
    static activarZona = async (req, res) => {
        const { id_zona } = req.params;
        try {
            const zona = await zona_1.default.findByPk(id_zona);
            if (!zona) {
                res.status(404).json({ error: 'Zona no encontrada' });
                return;
            }
            const invernadero = await invernadero_1.Invernadero.findByPk(zona.id_invernadero);
            if (!invernadero) {
                res.status(404).json({ error: 'Invernadero no encontrado' });
                return;
            }
            if (invernadero.estado !== 'activo') {
                res.status(400).json({
                    error: 'No se puede activar la zona porque el invernadero está inactivo o en mantenimiento',
                });
                return;
            }
            zona.estado = 'activo';
            await zona.save({ fields: ['estado'] });
            res.json({ mensaje: 'Zona activada correctamente', zona });
            return;
        }
        catch (error) {
            console.error('Error al activar zona:', error);
            res.status(500).json({ error: 'Error al activar zona', details: error });
            return;
        }
    };
    static mantenimientoZona = async (req, res) => {
        try {
            const { id_zona } = req.params;
            const zona = await zona_1.default.findByPk(id_zona);
            if (!zona) {
                res.status(404).json({ error: 'Zona no encontrada' });
                return;
            }
            zona.set('estado', 'mantenimiento');
            await zona.save({ fields: ['estado'] });
            await (0, actualizarConteoZona_1.actualizarConteoZonas)(zona.id_invernadero);
            res.json({ mensaje: 'Zona puesta en mantenimiento correctamente' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al cambiar zona a mantenimiento', details: error });
        }
    };
    static eliminarZona = async (req, res) => {
        try {
            const { id_zona } = req.params;
            const zona = await zona_1.default.findByPk(id_zona);
            if (!zona) {
                res.status(404).json({ error: 'Zona no encontrada' });
                return;
            }
            const id_invernadero = zona.id_invernadero;
            await zona.destroy();
            await (0, actualizarConteoZona_1.actualizarConteoZonas)(id_invernadero);
            res.json({ mensaje: 'Zona eliminada correctamente' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al eliminar la zona', details: error });
        }
    };
}
exports.zonaController = zonaController;
//# sourceMappingURL=zonaController.js.map