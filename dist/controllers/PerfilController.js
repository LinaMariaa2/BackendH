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
const bcrypt = __importStar(require("bcryptjs"));
// Función para obtener el perfil del usuario autenticado
const getOwnPerfil = async (req, res) => {
    try {
        // Asegurarse de que el usuario esté autenticado y su ID esté disponible
        if (!req.user || typeof req.user.id_persona !== 'number') { // Verificar tipo también
            console.error('DEBUG: getOwnPerfil - No autenticado o ID de usuario no disponible en req.user.');
            return res.status(401).json({ error: 'No autenticado o ID de usuario no disponible.' });
        }
        const id_persona = req.user.id_persona; // Obtener el ID de la persona del token JWT
        console.log('DEBUG: getOwnPerfil - Intentando obtener perfil para id_persona:', id_persona);
        const persona = await Persona_1.default.findByPk(id_persona, {
            include: [{ model: Perfil_1.default, as: 'perfil' }] // Incluir el perfil asociado
        });
        if (!persona) {
            console.error('DEBUG: getOwnPerfil - Persona NO encontrada para id_persona:', id_persona);
            return res.status(404).json({ error: 'Perfil de usuario no encontrado.' });
        }
        console.log('DEBUG: getOwnPerfil - Persona encontrada:', persona.nombre_usuario);
        // --- INICIO DE LA CORRECCIÓN: Crear perfil si no existe ---
        let perfilAsociado = persona.perfil;
        if (!perfilAsociado) {
            console.warn('DEBUG: getOwnPerfil - Perfil NO asociado a la persona. Creando un nuevo perfil para id_persona:', id_persona);
            // Crear un nuevo perfil con valores por defecto
            perfilAsociado = await Perfil_1.default.create({
                personaId: persona.id_persona,
                nombre_usuario: persona.nombre_usuario,
                correo: persona.correo,
                rol: persona.rol,
                estado: persona.estado,
                isVerified: persona.isVerified,
                foto_url: '' // Valor por defecto vacío
            });
            // Actualizar el objeto persona para que incluya el nuevo perfil
            persona.perfil = perfilAsociado;
            console.log('DEBUG: getOwnPerfil - Nuevo perfil creado y asociado.');
        }
        else {
            console.log('DEBUG: getOwnPerfil - Perfil asociado encontrado.');
        }
        // --- FIN DE LA CORRECCIÓN ---
        // Eliminar la contraseña antes de enviar la respuesta por seguridad
        const personaData = persona.toJSON();
        delete personaData.contrasena;
        return res.status(200).json({
            id_persona: personaData.id_persona,
            nombre_usuario: personaData.nombre_usuario,
            correo: personaData.correo,
            rol: personaData.rol,
            estado: personaData.estado,
            isVerified: personaData.isVerified,
            createdAt: personaData.createdAt,
            updatedAt: personaData.updatedAt,
            perfil: perfilAsociado // Asegurarse de enviar el perfil (el existente o el recién creado)
        });
    }
    catch (err) {
        console.error('DEBUG: getOwnPerfil - Error durante la operación:', err);
        return res.status(500).json({ error: 'Error interno del servidor al obtener el perfil.', details: err.message });
    }
};
exports.getOwnPerfil = getOwnPerfil;
// Función para actualizar el perfil del usuario autenticado
const actualizarPerfil = async (req, res) => {
    try {
        // Asegurarse de que el usuario esté autenticado y su ID esté disponible
        if (!req.user || typeof req.user.id_persona !== 'number') { // Verificar tipo también
            console.error('DEBUG: actualizarPerfil - No autenticado o ID de usuario no disponible en req.user.');
            return res.status(401).json({ error: 'No autenticado o ID de usuario no disponible.' });
        }
        const id_persona_from_token = req.user.id_persona; // ID del usuario autenticado
        const { nombre_usuario, correo, contrasena } = req.body; // Datos a actualizar
        console.log('DEBUG: actualizarPerfil - Intentando actualizar perfil para id_persona:', id_persona_from_token);
        // Buscar la persona y su perfil usando el ID del token
        const persona = await Persona_1.default.findByPk(id_persona_from_token);
        console.log('DEBUG: actualizarPerfil - Resultado de Persona.findByPk:', persona ? 'Encontrada' : 'NO ENCONTRADA');
        const perfil = await Perfil_1.default.findOne({ where: { personaId: id_persona_from_token } });
        console.log('DEBUG: actualizarPerfil - Resultado de Perfil.findOne:', perfil ? 'Encontrado' : 'NO ENCONTRADO');
        if (!persona || !perfil) {
            console.error('DEBUG: actualizarPerfil - Usuario o perfil NO encontrado para id_persona:', id_persona_from_token);
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
        console.log('DEBUG: actualizarPerfil - Persona guardada.');
        // Actualizar datos de Perfil
        if (nombre_usuario !== undefined)
            perfil.nombre_usuario = nombre_usuario;
        if (correo !== undefined)
            perfil.correo = correo;
        // La foto_url se actualiza en UserController.uploadProfilePhoto, no aquí
        await perfil.save();
        console.log('DEBUG: actualizarPerfil - Perfil guardado.');
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
        console.error('DEBUG: actualizarPerfil - Error durante la operación:', err);
        // Manejo de errores específicos, como violación de unicidad de correo
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'El correo electrónico ya está en uso.', details: err.message });
        }
        return res.status(500).json({ error: 'Error interno del servidor al actualizar el perfil.', details: err.message });
    }
};
exports.actualizarPerfil = actualizarPerfil;
//# sourceMappingURL=PerfilController.js.map