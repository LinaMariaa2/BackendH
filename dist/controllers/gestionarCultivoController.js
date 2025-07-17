"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gestionCultivoController = void 0;
const gestionarCultivos_1 = require("../models/gestionarCultivos");
const zona_1 = __importDefault(require("../models/zona"));
class gestionCultivoController {
    // Obtener todos los cultivos
    static getAll = async (_req, res) => {
        try {
            const cultivos = await gestionarCultivos_1.GestionCultivo.findAll({
                order: [['id_cultivo', 'ASC']],
            });
            res.json(cultivos);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener los cultivos', details: error });
        }
    };
    // Obtener cultivo por ID
    static getId = async (req, res) => {
        try {
            const { id } = req.params;
            const cultivo = await gestionarCultivos_1.GestionCultivo.findByPk(id);
            if (!cultivo) {
                res.status(404).json({ error: 'Cultivo no encontrado' });
                return;
            }
            res.json(cultivo);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener el cultivo', details: error });
        }
    };
    static cambiarEstado = async (req, res) => {
        const { id, estado } = req.params;
        if (!['activo', 'finalizado'].includes(estado)) {
            res.status(400).json({ error: 'Estado no válido' });
            return;
        }
        try {
            const cultivo = await gestionarCultivos_1.GestionCultivo.findByPk(id);
            if (!cultivo) {
                res.status(404).json({ error: 'Cultivo no encontrado' });
                return;
            }
            cultivo.estado = estado;
            await cultivo.save();
            res.json({ mensaje: `Estado cambiado a ${estado}`, cultivo });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al cambiar estado del cultivo', details: error });
        }
    };
    // Obtener cultivos por zona
    static getPorZona = async (req, res) => {
        const { id_zona } = req.params;
        try {
            const cultivos = await gestionarCultivos_1.GestionCultivo.findAll({
                where: { id_zona },
                order: [['fecha_inicio', 'DESC']],
            });
            res.json(cultivos);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener cultivos de la zona', details: error });
        }
    };
    // Crear cultivo
    static crearCultivo = async (req, res) => {
        try {
            const cultivo = await gestionarCultivos_1.GestionCultivo.create({
                ...req.body,
                estado: 'activo', // forzamos el estado inicial
            });
            // Actualiza el cultivo actual de la zona (si usas zonaCultivoActual o similar)
            await zona_1.default.update({ id_cultivo_actual: cultivo.id_cultivo }, { where: { id_zona: cultivo.id_zona } });
            res.status(201).json({ mensaje: 'Cultivo registrado correctamente', cultivo });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al registrar cultivo', details: error });
        }
    };
}
exports.gestionCultivoController = gestionCultivoController;
//# sourceMappingURL=gestionarCultivoController.js.map