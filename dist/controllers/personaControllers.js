"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonaController = void 0;
const Persona_1 = __importDefault(require("../models/Persona"));
const sequelize_1 = require("sequelize"); // Asegúrate de tener esto al inicio del archivo
//import { PasswordHelper } from '../helpers/passwordHelper'; 
class PersonaController {
    // Obtenemos todas las Personas
    static getAll = async (req, res) => {
        try {
            const filtro = req.query.filtro?.toString().toLowerCase() || "";
            const personas = await Persona_1.default.findAll({
                where: {
                    estado: "activo",
                    rol: "operario",
                    nombre_usuario: {
                        [sequelize_1.Op.iLike]: `%${filtro}%`, // PostgreSQL case-insensitive LIKE
                    },
                },
            });
            res.json(personas);
        }
        catch (error) {
            console.error("Error al obtener personas:", error);
            res.status(500).json({ message: "Error interno" });
        }
    };
    static getOperarios = async (req, res) => {
        try {
            const filtro = req.query.filtro?.toString().toLowerCase();
            const whereCond = {
                estado: "activo",
                rol: "operario",
            };
            if (filtro && filtro.trim() !== "") {
                whereCond.nombre_usuario = { [sequelize_1.Op.iLike]: `%${filtro}%` };
            }
            const personas = await Persona_1.default.findAll({
                where: whereCond,
            });
            res.json(personas);
        }
        catch (error) {
            console.error("Error al obtener personas:", error);
            res.status(500).json({ message: "Error interno" });
        }
    };
    // Personas Activas
    static getAllActivos = async (req, res) => {
        try {
            const personas = await Persona_1.default.findAll({
                where: { estado: 'activo' },
                order: [['id_persona', 'ASC']],
            });
            res.json(personas);
        }
        catch (error) {
            console.error('Error al obtener las personas activas:', error);
            res.status(500).json({
                error: 'Error al obtener todas las personas activas',
                details: error.message,
            });
        }
    };
    // Mostramos Persona por ID en ruta
    static async getById(req, res) {
        try {
            const idRaw = req.params.id;
            const id = parseInt(idRaw, 10);
            if (!idRaw || isNaN(id) || !Number.isInteger(id)) {
                res.status(400).json({ error: 'ID inválido' });
            }
            const persona = await Persona_1.default.findByPk(id);
            if (!persona) {
                res.status(404).json({ error: 'Persona no encontrada' });
                return;
            }
            res.json(persona);
        }
        catch (error) {
            console.error('Error al obtener persona por ID:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
    }
    // Crear una nueva Persona
    static crearPersona = async (req, res) => {
        try {
            // Nota: Las validaciones de formato de email, longitud de contraseña, etc.
            // deberían hacerse preferiblemente en un middleware antes de este controlador.
            const { contrasena, ...restOfBody } = req.body;
            // Aquí deberías hashear la contraseña antes de guardarla.
            // Si usas un helper como `PasswordHelper`:
            // const hashedPassword = await PasswordHelper.hashPassword(contrasena);
            // const personaData = { ...restOfBody, contrasena: hashedPassword };
            // Por ahora, solo usamos la contraseña directamente (NO RECOMENDADO EN PRODUCCIÓN SIN HASH)
            const personaData = { ...restOfBody, contrasena: contrasena };
            const persona = new Persona_1.default(personaData);
            await persona.save();
            // Puedes enviar la persona creada, excluyendo la contraseña si lo deseas
            const personaSinContrasena = persona.toJSON();
            delete personaSinContrasena.contrasena;
            res.status(201).json({ mensaje: 'Persona creada correctamente', persona: personaSinContrasena });
        }
        catch (error) {
            console.error('Error al crear la persona:', error);
            // Manejo específico para errores de restricción única (ej. correo duplicado)
            if (error.name === 'SequelizeUniqueConstraintError') {
                res.status(409).json({ error: 'El correo electrónico ya está registrado. Por favor, usa otro.', details: error.message });
                return;
            }
            // Manejo para errores de validación (ej. allowNull: false, ENUM)
            if (error.name === 'SequelizeValidationError') {
                res.status(400).json({ error: 'Datos de persona inválidos', details: error.errors.map((e) => e.message) });
                return;
            }
            res.status(500).json({
                error: 'Error al crear la persona',
                details: error instanceof Error ? error.message : String(error),
            });
        }
    };
    // Actualizar una Persona
    static actualizarPersona = async (req, res) => {
        try {
            const { id } = req.params;
            const { contrasena, ...updateData } = req.body; // Evita que la contraseña se actualice directamente sin hashear
            // Si se envía una nueva contraseña, debería hashearse
            // if (contrasena) {
            //   updateData.contrasena = await PasswordHelper.hashPassword(contrasena);
            // }
            const [rowsUpdated] = await Persona_1.default.update(updateData, {
                where: { id_persona: id },
            });
            if (rowsUpdated === 0) {
                res.status(404).json({ error: 'Persona no encontrada' });
                return;
            }
            const personaActualizada = await Persona_1.default.findByPk(id);
            // Opcional: excluye la contraseña de la respuesta
            const personaSinContrasena = personaActualizada ? personaActualizada.toJSON() : null;
            if (personaSinContrasena) {
                delete personaSinContrasena.contrasena;
            }
            res.json({ mensaje: 'Persona actualizada correctamente', persona: personaSinContrasena });
        }
        catch (error) {
            console.error('Error al actualizar persona:', error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                res.status(409).json({ error: 'El correo electrónico ya está registrado. Por favor, usa otro.', details: error.message });
                return;
            }
            if (error.name === 'SequelizeValidationError') {
                res.status(400).json({ error: 'Datos de persona inválidos', details: error.errors.map((e) => e.message) });
                return;
            }
            res.status(500).json({
                error: 'Error al actualizar la persona',
                details: error instanceof Error ? error.message : String(error),
            });
        }
    };
    // Cambiar estado a inactivo
    static inactivarPersona = async (req, res) => {
        try {
            const { id } = req.params;
            const persona = await Persona_1.default.findByPk(id);
            if (!persona) {
                res.status(404).json({ error: 'Persona no encontrada' });
                return;
            }
            persona.estado = 'inactivo';
            await persona.save(); // Sequelize guarda solo los campos modificados por defecto
            res.json({ mensaje: 'Persona inactivada correctamente' });
        }
        catch (error) {
            console.error('Error al inactivar la persona:', error);
            res.status(500).json({
                error: 'Error al inactivar la persona',
                details: error.message,
            });
        }
    };
    // Cambiar estado a activo
    static activarPersona = async (req, res) => {
        try {
            const { id } = req.params;
            const persona = await Persona_1.default.findByPk(id);
            if (!persona) {
                res.status(404).json({ error: 'Persona no encontrada' });
                return;
            }
            persona.estado = 'activo';
            await persona.save();
            res.json({ mensaje: 'Persona activada correctamente' });
        }
        catch (error) {
            console.error('Error al activar la persona:', error);
            res.status(500).json({
                error: 'Error al activar la persona',
                details: error.message,
            });
        }
    };
    // Cambiar estado a bloqueado
    static bloquearPersona = async (req, res) => {
        try {
            const { id } = req.params;
            const persona = await Persona_1.default.findByPk(id);
            if (!persona) {
                res.status(404).json({ error: 'Persona no encontrada' });
                return;
            }
            persona.estado = 'bloqueado';
            await persona.save();
            res.json({ mensaje: 'Persona bloqueada correctamente' });
        }
        catch (error) {
            console.error('Error al bloquear la persona:', error);
            res.status(500).json({
                error: 'Error al bloquear la persona',
                details: error.message,
            });
        }
    };
    // Eliminar Persona permanentemente
    static eliminarPersona = async (req, res) => {
        try {
            const { id } = req.params;
            const persona = await Persona_1.default.findByPk(id);
            if (!persona) {
                res.status(404).json({ error: 'Persona no encontrada' });
                return;
            }
            // Opcional: Podrías añadir una validación aquí para solo eliminar personas "inactivas"
            // if (persona.estado !== 'inactivo') {
            //   res.status(400).json({ error: 'Solo se puede eliminar una persona inactiva' });
            //   return;
            // }
            await persona.destroy();
            res.json({ mensaje: 'Persona eliminada permanentemente' });
        }
        catch (error) {
            console.error('Error al eliminar la persona:', error);
            res.status(500).json({
                error: 'Error al eliminar la persona',
                details: error.message,
            });
        }
    };
}
exports.PersonaController = PersonaController;
//# sourceMappingURL=personaControllers.js.map