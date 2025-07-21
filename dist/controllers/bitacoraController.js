"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitacoraController = void 0;
const bitacora_1 = require("../models/bitacora");
const invernadero_1 = require("../models/invernadero");
const zona_1 = require("../models/zona");
const Persona_1 = require("../models/Persona");
class bitacoraController {
    // Obtener todas las publicaciones
    // bitacoraController.ts
    static getAll = async (req, res) => {
        try {
            const { archivadas } = req.query;
            let whereClause = {};
            if (archivadas === 'true') {
                whereClause = { archivada: true };
            }
            else if (archivadas === 'false') {
                whereClause = { archivada: false };
            }
            const publicaciones = await bitacora_1.Bitacora.findAll({
                where: whereClause,
                include: [invernadero_1.Invernadero, zona_1.Zona, Persona_1.Persona],
                order: [['timestamp_publicacion', 'DESC']],
            });
            res.json(publicaciones);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener las publicaciones', details: error });
        }
    };
    // Obtener publicación por ID
    static getById = async (req, res) => {
        try {
            const { id } = req.params;
            const publicacion = await bitacora_1.Bitacora.findByPk(id, {
                include: [invernadero_1.Invernadero, zona_1.Zona, Persona_1.Persona],
            });
            if (!publicacion) {
                res.status(404).json({ error: 'Publicación no encontrada' });
                return;
            }
            res.json(publicacion);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener la publicación', details: error });
        }
    };
    // Crear publicación
    static crear = async (req, res) => {
        try {
            const nueva = await bitacora_1.Bitacora.create(req.body);
            res.status(201).json({ mensaje: 'Publicación creada correctamente', nueva });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al crear la publicación', details: error });
        }
        console.log("REQ BODY", req.body);
    };
    // Actualizar publicación
    static actualizar = async (req, res) => {
        try {
            const { id } = req.params;
            const [updated] = await bitacora_1.Bitacora.update(req.body, { where: { id_publicacion: id } });
            if (updated === 0) {
                res.status(404).json({ error: 'Publicación no encontrada' });
                return;
            }
            res.json({ mensaje: 'Publicación actualizada correctamente' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al actualizar la publicación', details: error });
        }
    };
    // Eliminar (solo si no es importante o archivable primero)
    static eliminar = async (req, res) => {
        try {
            const { id } = req.params;
            const publicacion = await bitacora_1.Bitacora.findByPk(id);
            if (!publicacion) {
                res.status(404).json({ error: 'Publicación no encontrada' });
                return;
            }
            if (publicacion.importancia === 'alta') {
                res.status(400).json({ error: 'No se puede eliminar una publicación de importancia alta' });
                return;
            }
            await publicacion.destroy();
            res.json({ mensaje: 'Publicación eliminada correctamente' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al eliminar la publicación', details: error });
        }
    };
    // Filtrar por invernadero
    static getByInvernadero = async (req, res) => {
        try {
            const { id_invernadero } = req.params;
            const publicaciones = await bitacora_1.Bitacora.findAll({
                where: { id_invernadero },
                include: [zona_1.Zona, Persona_1.Persona],
                order: [['timestamp_publicacion', 'DESC']],
            });
            res.json(publicaciones);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener publicaciones del invernadero', details: error });
        }
    };
    // Archivar publicación (cambia importancia a 'baja')
    static archivar = async (req, res) => {
        try {
            const { id } = req.params;
            const publicacion = await bitacora_1.Bitacora.findByPk(id);
            if (!publicacion) {
                res.status(404).json({ error: 'Publicación no encontrada' });
                return;
            }
            publicacion.archivada = true;
            await publicacion.save();
            res.json({ mensaje: 'Publicación archivada correctamente' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al archivar la publicación', details: error });
        }
    };
    // Desarchivar (poner importancia en 'media')
    static desarchivar = async (req, res) => {
        try {
            const { id } = req.params;
            const publicacion = await bitacora_1.Bitacora.findByPk(id);
            if (!publicacion) {
                res.status(404).json({ error: 'Publicación no encontrada' });
                return;
            }
            publicacion.archivada = false;
            await publicacion.save();
            res.json({ mensaje: 'Publicación desarchivada correctamente' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al desarchivar', details: error });
        }
    };
}
exports.bitacoraController = bitacoraController;
//# sourceMappingURL=bitacoraController.js.map