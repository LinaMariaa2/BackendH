"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualizarPerfil = exports.getOwnPerfil = void 0;
const Perfil_1 = __importDefault(require("../models/Perfil"));
const Persona_1 = __importDefault(require("../models/Persona"));
const bcrypt = __importStar(require("bcryptjs")); // Importar bcryptjs para el hashing de contraseñas
// Función para obtener el perfil del usuario autenticado
const getOwnPerfil = async (req, res) => {
    try {
        // Asegurarse de que el usuario esté autenticado y su ID esté disponible
        if (!req.user || !req.user.id_persona) {
            return res.status(401).json({ error: 'No autenticado o ID de usuario no disponible.' });
        }
        const id_persona = req.user.id_persona; // Obtener el ID de la persona del token JWT
        const persona = await Persona_1.default.findByPk(id_persona, {
            include: [{ model: Perfil_1.default, as: 'perfil' }] // Incluir el perfil asociado
        });
        if (!persona) {
            return res.status(404).json({ error: 'Perfil de usuario no encontrado.' });
        }
        // Eliminar la contraseña antes de enviar la respuesta por seguridad
        const personaData = persona.toJSON();
        delete personaData.contrasena;
        // Si el perfil está anidado, lo extraemos o lo enviamos como parte de la respuesta
        // Asegurarse de que 'perfil' es el alias correcto de la relación en tu modelo Persona
        return res.status(200).json({
            id_persona: personaData.id_persona,
            nombre_usuario: personaData.nombre_usuario,
            correo: personaData.correo,
            rol: personaData.rol,
            estado: personaData.estado,
            isVerified: personaData.isVerified,
            createdAt: personaData.createdAt,
            updatedAt: personaData.updatedAt,
            perfil: personaData.perfil // Enviar el objeto perfil completo si está disponible
        });
    }
    catch (err) {
        console.error('Error al obtener el perfil:', err);
        return res.status(500).json({ error: 'Error interno del servidor al obtener el perfil.', details: err.message });
    }
};
exports.getOwnPerfil = getOwnPerfil;
// Función para actualizar el perfil del usuario autenticado
const actualizarPerfil = async (req, res) => {
    try {
        // Asegurarse de que el usuario esté autenticado y su ID esté disponible
        if (!req.user || !req.user.id_persona) {
            return res.status(401).json({ error: 'No autenticado o ID de usuario no disponible.' });
        }
        const id_persona_from_token = req.user.id_persona; // ID del usuario autenticado
        const { nombre_usuario, correo, contrasena } = req.body; // Datos a actualizar
        // Buscar la persona y su perfil usando el ID del token
        const persona = await Persona_1.default.findByPk(id_persona_from_token);
        const perfil = await Perfil_1.default.findOne({ where: { personaId: id_persona_from_token } });
        if (!persona || !perfil) {
            return res.status(404).json({ error: 'Usuario o perfil no encontrado.' });
        }
        // Actualizar datos de Persona
        if (nombre_usuario !== undefined)
            persona.nombre_usuario = nombre_usuario;
        if (correo !== undefined)
            persona.correo = correo;
        if (contrasena) {
            // Hashear la nueva contraseña si se proporciona
            persona.contrasena = await bcrypt.hash(contrasena, 10);
        }
        await persona.save();
        // Actualizar datos de Perfil
        if (nombre_usuario !== undefined)
            perfil.nombre_usuario = nombre_usuario;
        if (correo !== undefined)
            perfil.correo = correo;
        await perfil.save();
        // Preparar la respuesta sin la contraseña
        const updatedPersonaData = persona.toJSON();
        delete updatedPersonaData.contrasena;
        return res.status(200).json({
            message: 'Perfil actualizado exitosamente',
            perfil: {
                id_persona: updatedPersonaData.id_persona,
                nombre_usuario: updatedPersonaData.nombre_usuario,
                correo: updatedPersonaData.correo,
                rol: updatedPersonaData.rol,
                estado: updatedPersonaData.estado,
                isVerified: updatedPersonaData.isVerified,
                createdAt: updatedPersonaData.createdAt,
                updatedAt: updatedPersonaData.updatedAt,
                foto_url: perfil.foto_url // Incluir la foto_url del perfil
            }
        });
    }
    catch (err) {
        console.error('Error al actualizar el perfil:', err);
        // Manejo de errores específicos, como violación de unicidad de correo
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'El correo electrónico ya está en uso.', details: err.message });
        }
        return res.status(500).json({ error: 'Error interno del servidor al actualizar el perfil.', details: err.message });
    }
};
exports.actualizarPerfil = actualizarPerfil;
//# sourceMappingURL=PerfilController.js.map