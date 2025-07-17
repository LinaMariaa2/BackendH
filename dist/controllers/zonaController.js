"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zonaController = void 0;
const zona_1 = __importDefault(require("../models/zona"));
const actualizarConteoZona_1 = require("../helpers/actualizarConteoZona");
const gestionarCultivos_1 = require("../models/gestionarCultivos");
const ZonaCultivoActual_1 = require("../models/ZonaCultivoActual");
const invernadero_1 = require("../models/invernadero");
class zonaController {
    static getAll = async (req, res) => {
        try {
            const zonas = await zona_1.default.findAll({
                order: [['id_zona', 'ASC']],
            });
            res.json(zonas);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener las zonas', details: error });
        }
    };
    static getAllActivos = async (req, res) => {
        try {
            const zona = await zona_1.default.findAll({
                where: { estado: 'activo' },
                order: [['id_zona', 'ASC']],
            });
            res.json(zona);
        }
        catch (error) {
            res.status(500).json({
                error: 'Error al obtener todos las zonas',
                details: error,
            });
        }
    };
    static getZonasPorInvernadero = async (req, res) => {
        const { id } = req.params;
        try {
            const zonas = await zona_1.default.findAll({
                where: { id_invernadero: id }
            });
            res.json(zonas);
        }
        catch (error) {
            res.status(500).json({ message: 'Error al obtener zonas del invernadero', error });
        }
    };
    static obtenerCultivoActualPorZona = async (req, res) => {
        try {
            const id_zona = parseInt(req.params.id, 10);
            const zonaCultivo = await ZonaCultivoActual_1.ZonaCultivoActual.findOne({
                where: { id_zona },
                include: [
                    {
                        model: gestionarCultivos_1.GestionCultivo,
                        as: 'cultivo', // importante que coincida con el @BelongsTo
                        required: true
                    }
                ]
            });
            console.log('zonaCultivo ===>', zonaCultivo);
            if (!zonaCultivo || !zonaCultivo.cultivo) {
                res.status(404).json({ mensaje: 'No hay cultivo actual para esta zona.' });
                return;
            }
            res.json(zonaCultivo.cultivo);
            return;
        }
        catch (error) {
            console.error('Error al obtener el cultivo actual:', error);
            res.status(500).json({ mensaje: 'Error del servidor.' });
            return;
        }
    };
    static getById = async (req, res) => {
        try {
            const { id_zona } = req.params;
            const zona = await zona_1.default.findByPk(id_zona);
            if (!zona) {
                res.status(404).json({ error: 'Zona no encontrada' });
                return;
            }
            res.json(zona);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener la zona', details: error });
        }
    };
    static crearZona = async (req, res) => {
        try {
            const zona = new zona_1.default(req.body);
            await zona.save();
            await (0, actualizarConteoZona_1.actualizarConteoZonas)(zona.id_invernadero);
            res.status(201).json({ mensaje: 'Zona creada correctamente', zona });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al crear la zona', details: error });
        }
    };
    static actualizarZona = async (req, res) => {
        try {
            const { id } = req.params;
            const [updated] = await zona_1.default.update(req.body, {
                where: { id_zona: id },
            });
            if (updated === 0) {
                res.status(404).json({ error: 'Zona no encontrada' });
                return;
            }
            const zonaActualizada = await zona_1.default.findByPk(id);
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
        try {
            const { id } = req.params;
            const { estado } = req.body;
            if (!['activo', 'inactivo', 'mantenimiento'].includes(estado)) {
                res.status(400).json({ error: 'Estado inválido' });
                return;
            }
            const invernadero = await invernadero_1.Invernadero.findByPk(id);
            if (!invernadero) {
                res.status(404).json({ error: 'Invernadero no encontrado' });
                return;
            }
            invernadero.estado = estado;
            await invernadero.save({ fields: ['estado'] });
            res.json({ mensaje: 'Estado actualizado correctamente', invernadero });
        }
        catch (error) {
            console.error('Error al cambiar estado:', error);
            res.status(500).json({ error: 'Error al cambiar estado', details: error });
        }
    };
    static inactivarZona = async (req, res) => {
        try {
            const { id } = req.params;
            const zona = await zona_1.default.findByPk(id);
            if (!zona) {
                res.status(404).json({ error: 'Zona no encontrada' });
                return;
            }
            zona.set('estado', 'inactivo');
            await zona.save({ fields: ['estado'] });
            res.json({ mensaje: 'Zona inactivada correctamente' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al inactivar la zona', details: error });
        }
    };
    static activarZona = async (req, res) => {
        try {
            const { id } = req.params;
            const zona = await zona_1.default.findByPk(id);
            if (!zona) {
                res.status(404).json({ error: 'Zona no encontrada' });
                return;
            }
            zona.set('estado', 'activo');
            await zona.save({ fields: ['estado'] });
            res.json({ mensaje: 'Zona activada correctamente' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al activar la zona', details: error });
        }
    };
    static mantenimientoZona = async (req, res) => {
        try {
            const { id } = req.params;
            const zona = await zona_1.default.findByPk(id);
            if (!zona) {
                res.status(404).json({ error: 'Zona no encontrada' });
                return;
            }
            zona.set('estado', 'mantenimiento');
            await zona.save({ fields: ['estado'] });
            res.json({ mensaje: 'Zona puesta en mantenimiento correctamente' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al cambiar zona a mantenimiento', details: error });
        }
    };
    //organizar la validacion de programaciones asociadas
    static eliminarZona = async (req, res) => {
        try {
            const { id } = req.params;
            const zona = await zona_1.default.findByPk(id);
            if (!zona) {
                res.status(404).json({ error: 'Zona no encontrada' });
                return;
            }
            await zona.destroy();
            res.json({ mensaje: 'Zona eliminada correctamente' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al eliminar la zona', details: error });
        }
    };
}
exports.zonaController = zonaController;
//# sourceMappingURL=zonaController.js.map