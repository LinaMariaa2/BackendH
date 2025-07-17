"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invernaderoController = void 0;
const invernadero_1 = __importDefault(require("../models/invernadero"));
class invernaderoController {
    // obtenemos todos los Invernaderos
    static getAll = async (req, res) => {
        try {
            const invernaderos = await invernadero_1.default.findAll({
                order: [['id_invernadero', 'ASC']], //ordenamos en ascendente con la PK
            });
            res.json(invernaderos);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener los invernaderos', details: error });
        }
    };
    //Invernaderos Activos
    static getAllActivos = async (req, res) => {
        try {
            const invernaderos = await invernadero_1.default.findAll({
                where: { estado: 'activo' },
                order: [['id_invernadero', 'ASC']],
            });
            res.json(invernaderos);
        }
        catch (error) {
            res.status(500).json({
                error: 'Error al obtener todos los invernaderos',
                details: error,
            });
        }
    };
    // Mostramos invernadero por ID en ruta
    static getId = async (req, res) => {
        try {
            const { id } = req.params;
            const invernadero = await invernadero_1.default.findByPk(id);
            if (!invernadero) {
                const error = new Error('Invernadero No encontrado, estas seguro de que existe');
                res.status(404).json({ error: error.message });
            }
            res.json(invernadero);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener el invernadero', details: error });
            return;
        }
    };
    // Crear un nuevo invernadero con limite de 5 maximo
    static crearInvernadero = async (req, res) => {
        try {
            const totalInvernaderos = await invernadero_1.default.count(); //cuenta los invernaderos existentes
            if (totalInvernaderos >= 6) {
                res.status(400).json({
                    error: 'No se pueden crear más de 5 invernaderos'
                });
            }
            // Crear el nuevo invernadero
            const invernadero = new invernadero_1.default(req.body);
            await invernadero.save();
            res.status(201).json({ mensaje: 'Invernadero creado correctamente' });
            return;
        }
        catch (error) {
            res.status(500).json({
                error: 'Error al crear el invernadero',
                details: error instanceof Error ? error.message : error
            });
        }
    };
    // Actualizar un invernadero
    static actualizarInvernadero = async (req, res) => {
        try {
            const { id } = req.params;
            const [rowsUpdated] = await invernadero_1.default.update(req.body, {
                where: { id_invernadero: id },
            });
            if (rowsUpdated === 0) {
                res.status(404).json({ error: 'Invernadero no encontrado' });
            }
            res.json({ mensaje: 'Invernadero actualizado correctamente' });
        }
        catch (error) {
            console.error('Error al actualizar invernadero:', error);
            res.status(500).json({
                error: 'Error al actualizar el invernadero',
                detalles: error instanceof Error ? error.message : String(error)
            });
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
            const invernadero = await invernadero_1.default.findByPk(id);
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
    static inactivarInvernadero = async (req, res) => {
        try {
            const { id } = req.params;
            const invernadero = await invernadero_1.default.findByPk(id);
            if (!invernadero) {
                res.status(404).json({ error: 'Invernadero no encontrado' });
                return;
            }
            invernadero.set('estado', 'inactivo');
            await invernadero.save({ fields: ['estado'] });
            res.json({ mensaje: 'Invernadero inactivado correctamente' });
        }
        catch (error) {
            res.status(500).json({
                error: 'Error al inactivar el invernadero',
                details: error.message,
            });
        }
    };
    static activarInvernadero = async (req, res) => {
        try {
            const { id } = req.params;
            const invernadero = await invernadero_1.default.findByPk(id);
            if (!invernadero) {
                res.status(404).json({ error: 'Invernadero no encontrado' });
                return;
            }
            invernadero.set('estado', 'activo');
            await invernadero.save({ fields: ['estado'] });
            res.json({ mensaje: 'Invernadero activadp correctamente' });
        }
        catch (error) {
            res.status(500).json({
                error: 'Error al activar el invernadero',
                details: error.message,
            });
        }
    };
    static mantenimientoInvernadero = async (req, res) => {
        try {
            const { id } = req.params;
            const invernadero = await invernadero_1.default.findByPk(id);
            if (!invernadero) {
                res.status(404).json({ error: 'Invernadero no encontrado' });
                return;
            }
            invernadero.set('estado', 'mantenimiento');
            await invernadero.save({ fields: ['estado'] });
            res.json({ mensaje: 'Invernadero ´puestp en mantenimiento correctamente' });
        }
        catch (error) {
            res.status(500).json({
                error: 'Error al inactivar el invernadero en mantenimiento',
                details: error.message,
            });
        }
    };
    static eliminarInvernadero = async (req, res) => {
        try {
            const { id } = req.params;
            const invernadero = await invernadero_1.default.findByPk(id);
            if (!invernadero) {
                res.status(404).json({ error: 'Invernadero no encontrado' });
                return;
            }
            if (invernadero.estado !== 'inactivo') {
                res.status(400).json({ error: 'Solo se puede eliminar un invernadero inactivo' });
                return;
            }
            const zonasActivas = await invernadero.$count('zonas', {
                where: { estado: 'activo' }
            });
            if (zonasActivas > 0) {
                res.status(400).json({
                    error: 'No se puede eliminar el invernadero porque tiene zonas activas asociadas'
                });
            }
            await invernadero.destroy();
            res.json({ mensaje: 'Invernadero eliminado permanentemente' });
        }
        catch (error) {
            res.status(500).json({
                error: 'Error al eliminar el invernadero',
                details: error.message,
            });
        }
    };
}
exports.invernaderoController = invernaderoController;
//# sourceMappingURL=invernaderoController.js.map