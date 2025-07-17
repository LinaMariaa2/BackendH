"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gestionCultivoController = void 0;
const gestionarCultivos_1 = require("../models/gestionarCultivos");
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
            res.json({ mensaje: 'Estado actualizado', cultivo });
            return;
        }
        catch (error) {
            res.status(500).json({ error: 'Error al cambiar el estado', details: error });
            return;
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
            res.status(201).json({ mensaje: 'Cultivo registrado correctamente', cultivo });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al registrar cultivo', details: error });
        }
        console.log("📥 Datos recibidos:", req.body);
    };
    static eliminarCultivo = async (req, res) => {
        try {
            const { id } = req.params;
            const cultivo = await gestionarCultivos_1.GestionCultivo.findByPk(id);
            if (!cultivo) {
                res.status(404).json({ error: 'Cultivo no encontrado' });
                return;
            }
            await cultivo.destroy();
            res.json({ mensaje: 'Cultivo eliminado correctamente' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al eliminar cultivo', details: error });
        }
    };
    static actualizarCultivo = async (req, res) => {
        try {
            const { id } = req.params;
            const cultivo = await gestionarCultivos_1.GestionCultivo.findByPk(id);
            if (!cultivo) {
                res.status(404).json({ error: "Cultivo no encontrado" });
                return;
            }
            await cultivo.update(req.body);
            res.json({ mensaje: "Cultivo actualizado", cultivo });
            return;
        }
        catch (error) {
            res.status(500).json({ error: "Error al actualizar cultivo", details: error });
            return;
        }
    };
}
exports.gestionCultivoController = gestionCultivoController;
//# sourceMappingURL=gestionarCultivoController.js.map