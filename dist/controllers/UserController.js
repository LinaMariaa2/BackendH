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
exports.UserController = void 0;
const Persona_1 = __importDefault(require("../models/Persona"));
const Perfil_1 = __importDefault(require("../models/Perfil")); // Asegúrate de importar el modelo Perfil
const supabase_js_1 = require("@supabase/supabase-js"); // Importar Supabase Client
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt = __importStar(require("bcryptjs")); // Asegúrate de que bcryptjs esté importado para actualizar personas
dotenv_1.default.config(); // Cargar variables de entorno
// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Usamos la SERVICE_KEY para operaciones de servidor
if (!supabaseUrl || !supabaseServiceKey) {
    console.error("ERROR FATAL: SUPABASE_URL o SUPABASE_SERVICE_KEY no están definidas en las variables de entorno.");
    process.exit(1);
}
// Creamos una única instancia del cliente Supabase para ser reutilizada
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
class UserController {
    // Método para subir la foto de perfil
    static uploadProfilePhoto = async (req, res) => {
        try {
            const { id_persona } = req.params; // ID de la persona de los parámetros de la URL
            const userIdFromToken = req.user?.id_persona; // ID del usuario autenticado del token
            // Validar que el usuario autenticado sea el dueño del perfil o un admin
            if (req.user?.rol !== 'admin' && userIdFromToken !== parseInt(id_persona)) {
                return res.status(403).json({ error: 'Acceso denegado. No tienes permiso para actualizar esta foto de perfil.' });
            }
            if (!req.file) {
                return res.status(400).json({ error: 'No se proporcionó ningún archivo de imagen.' });
            }
            const file = req.file;
            // Generar un nombre de archivo único para evitar colisiones
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `profile_pictures/${id_persona}-${Date.now()}.${fileExtension}`; // Carpeta 'profile_pictures' dentro del bucket
            // ¡IMPORTANTE! Reemplaza 'perfil-fotos' con el nombre EXACTO de tu bucket en Supabase.
            // Si tu bucket se llama 'profile-pictures', cámbialo aquí.
            const bucketName = 'perfil-fotos'; // <--- VERIFICA ESTE NOMBRE EN TU SUPABASE
            const { data, error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: true, // Sobrescribe si el archivo ya existe (útil para actualizaciones)
            });
            if (uploadError) {
                console.error('Error al subir la imagen a Supabase:', uploadError);
                return res.status(500).json({ error: 'Error al subir la imagen.', details: uploadError.message });
            }
            // --- INICIO DE LA SECCIÓN CRÍTICA DE LA CORRECCIÓN ---
            // getPublicUrl devuelve un objeto con 'data' y NO tiene una propiedad 'error' en el mismo nivel.
            // Los errores de getPublicUrl se manejan a través de:
            // 1. publicUrlData siendo null/undefined (capturado por el siguiente if)
            // 2. La función lanzando una excepción (capturada por el try...catch externo)
            const { data: publicUrlData } = supabase.storage // <-- Eliminado 'error: publicUrlError' de aquí
                .from(bucketName) // Mismo nombre de bucket
                .getPublicUrl(fileName);
            // La verificación de publicUrlError se elimina porque no existe como propiedad directa aquí.
            // if (publicUrlError) {
            //     console.error('Error al obtener la URL pública de la imagen:', publicUrlError);
            //     return res.status(500).json({ error: 'Error al obtener la URL pública de la imagen.', details: publicUrlError.message });
            // }
            if (!publicUrlData || !publicUrlData.publicUrl) {
                // Esta es una verificación adicional por si publicUrlData es null/undefined o no tiene publicUrl
                console.error('DEBUG: publicUrlData o publicUrlData.publicUrl es nulo/indefinido.');
                return res.status(500).json({ error: 'No se pudo obtener la URL pública de la imagen.' });
            }
            const photoUrl = publicUrlData.publicUrl; // Acceso correcto a publicUrl
            // --- FIN DE LA SECCIÓN CRÍTICA DE LA CORRECCIÓN ---
            // Actualizar la URL de la foto en el perfil del usuario en la base de datos
            const perfil = await Perfil_1.default.findOne({ where: { personaId: id_persona } });
            if (!perfil) {
                // Si por alguna razón no hay perfil, podrías crearlo aquí (aunque no debería pasar si el registro es correcto)
                console.warn(`Perfil no encontrado para la persona ${id_persona}. Creando uno nuevo con la foto.`);
                const persona = await Persona_1.default.findByPk(id_persona);
                if (persona) {
                    await Perfil_1.default.create({
                        personaId: persona.id_persona,
                        nombre_usuario: persona.nombre_usuario,
                        correo: persona.correo,
                        rol: persona.rol,
                        estado: persona.estado,
                        isVerified: persona.isVerified,
                        foto_url: photoUrl
                    });
                }
                else {
                    return res.status(404).json({ error: 'Persona no encontrada para actualizar o crear perfil con foto.' });
                }
            }
            else {
                perfil.foto_url = photoUrl;
                await perfil.save();
            }
            return res.status(200).json({ message: 'Foto de perfil actualizada exitosamente.', foto_url: photoUrl });
        }
        catch (error) {
            console.error('Error inesperado en uploadProfilePhoto:', error);
            return res.status(500).json({ error: 'Error interno del servidor al procesar la subida de la foto.', details: error.message });
        }
    };
    // Obtener todas las Personas (Solo Admin)
    static getAll = async (req, res) => {
        try {
            const personas = await Persona_1.default.findAll({
                include: [{ model: Perfil_1.default, as: 'perfil' }],
                order: [['id_persona', 'ASC']],
            });
            // Eliminar la contraseña y añadir foto_url al nivel superior antes de enviar la respuesta
            const personasFormatted = personas.map(p => {
                const personaObj = p.toJSON();
                delete personaObj.contrasena;
                // Añadir foto_url directamente al objeto persona para facilitar el consumo en el frontend
                personaObj.foto_url = personaObj.perfil?.foto_url || '';
                return personaObj;
            });
            res.json(personasFormatted);
        }
        catch (error) {
            console.error('Error al obtener todas las personas:', error);
            res.status(500).json({ error: 'Error al obtener personas', details: error.message });
        }
    };
    // Obtener Personas Activas y Verificadas (Solo Admin)
    static getAllActivos = async (req, res) => {
        try {
            const personas = await Persona_1.default.findAll({
                where: {
                    estado: 'activo',
                    isVerified: true
                },
                include: [{ model: Perfil_1.default, as: 'perfil' }],
                order: [['id_persona', 'ASC']],
            });
            // Eliminar la contraseña y añadir foto_url al nivel superior antes de enviar la respuesta
            const personasFormatted = personas.map(p => {
                const personaObj = p.toJSON();
                delete personaObj.contrasena;
                personaObj.foto_url = personaObj.perfil?.foto_url || '';
                return personaObj;
            });
            res.status(200).json(personasFormatted);
        }
        catch (error) {
            console.error('Error al obtener perfiles activos:', error);
            res.status(500).json({ error: 'Error interno del servidor.', details: error.message });
        }
    };
    // Mostrar Persona por ID (Solo Admin o el propio usuario si es su ID)
    static getById = async (req, res) => {
        const { id_persona } = req.params;
        try {
            const persona = await Persona_1.default.findByPk(id_persona, {
                include: [{ model: Perfil_1.default, as: 'perfil' }]
            });
            if (!persona) {
                res.status(404).json({ error: 'Persona no encontrada, ¿estás seguro de que existe?' });
                return;
            }
            // Eliminar la contraseña y añadir foto_url al nivel superior antes de enviar la respuesta
            const personaFormatted = persona.toJSON();
            delete personaFormatted.contrasena;
            personaFormatted.foto_url = personaFormatted.perfil?.foto_url || '';
            res.json(personaFormatted);
        }
        catch (error) {
            console.error('Error al obtener la persona por ID:', error);
            res.status(500).json({ error: 'Error al obtener la persona', details: error.message });
        }
    };
    // Crear una nueva Persona (Admin only - aunque en el flujo de authRouter se gestiona el registro)
    static crearPersona = async (req, res) => {
        try {
            const { contrasena, ...restOfBody } = req.body;
            const hashedPassword = await bcrypt.hash(contrasena, 10);
            const personaData = { ...restOfBody, contrasena: hashedPassword };
            const persona = new Persona_1.default(personaData);
            await persona.save();
            // Crear o actualizar el Perfil asociado
            let perfil = await Perfil_1.default.findOne({ where: { personaId: persona.id_persona } });
            if (perfil) {
                Object.assign(perfil, {
                    nombre_usuario: persona.nombre_usuario,
                    correo: persona.correo,
                    rol: persona.rol,
                    estado: persona.estado,
                    isVerified: persona.isVerified,
                });
                await perfil.save();
            }
            else {
                await Perfil_1.default.create({
                    personaId: persona.id_persona,
                    nombre_usuario: persona.nombre_usuario,
                    correo: persona.correo,
                    rol: persona.rol,
                    estado: persona.estado,
                    isVerified: persona.isVerified,
                    foto_url: '' // Valor por defecto si no se sube foto
                });
            }
            const personaWithoutPassword = persona.toJSON();
            delete personaWithoutPassword.contrasena;
            res.status(201).json({ mensaje: 'Persona creada correctamente', persona: personaWithoutPassword });
        }
        catch (error) {
            console.error('Error al crear la persona:', error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                res.status(409).json({ error: 'El correo electrónico ya está registrado. Por favor, usa otro.', details: error.message });
                return;
            }
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
    // Actualizar una Persona (Solo Admin, o ciertos campos para el propio usuario)
    static actualizarPersona = async (req, res) => {
        try {
            const { id_persona } = req.params;
            const { contrasena, ...updateData } = req.body;
            const persona = await Persona_1.default.findByPk(id_persona);
            if (!persona) {
                res.status(404).json({ error: 'Persona no encontrada' });
                return;
            }
            if (contrasena) {
                // Si se proporciona una nueva contraseña, hashearla
                updateData.contrasena = await bcrypt.hash(contrasena, 10);
            }
            await persona.update(updateData);
            // Actualizar el perfil asociado con los datos actualizados
            let perfil = await Perfil_1.default.findOne({ where: { personaId: persona.id_persona } });
            if (perfil) {
                Object.assign(perfil, {
                    nombre_usuario: updateData.nombre_usuario || persona.nombre_usuario,
                    correo: updateData.correo || persona.correo,
                    rol: updateData.rol || persona.rol,
                    estado: updateData.estado || persona.estado,
                    isVerified: updateData.isVerified !== undefined ? updateData.isVerified : persona.isVerified,
                });
                await perfil.save();
            }
            else {
                console.warn(`Perfil no encontrado para la persona ${id_persona}. Creando uno nuevo.`);
                await Perfil_1.default.create({
                    personaId: persona.id_persona,
                    nombre_usuario: persona.nombre_usuario,
                    correo: persona.correo,
                    rol: persona.rol,
                    estado: persona.estado,
                    isVerified: persona.isVerified,
                    foto_url: '' // O la foto_url existente si se quiere mantener
                });
            }
            const updatedPersonaWithoutPassword = persona.toJSON();
            delete updatedPersonaWithoutPassword.contrasena;
            res.status(200).json({ mensaje: 'Persona actualizada correctamente', persona: updatedPersonaWithoutPassword });
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
    // Método auxiliar para actualizar el estado de una persona (consolida inactivar, activar, bloquear)
    static async actualizarEstadoPersona(req, res, nuevoEstado) {
        try {
            const { id_persona } = req.params;
            const persona = await Persona_1.default.findByPk(id_persona);
            if (!persona) {
                res.status(404).json({ error: 'Usuario no encontrado.' });
                return;
            }
            persona.estado = nuevoEstado;
            await persona.save();
            // También actualizar el estado en la tabla Perfil
            const perfil = await Perfil_1.default.findOne({ where: { personaId: id_persona } });
            if (perfil) {
                perfil.estado = nuevoEstado;
                await perfil.save();
            }
            res.status(200).json({ message: `Usuario actualizado a estado '${nuevoEstado}'.` });
        }
        catch (error) {
            console.error(`Error al cambiar estado a ${nuevoEstado}:`, error);
            res.status(500).json({ error: 'Error interno del servidor.', details: error.message });
        }
    }
    // Cambiar estado a inactivo
    static inactivarPersona = async (req, res) => {
        await UserController.actualizarEstadoPersona(req, res, 'inactivo');
    };
    // Cambiar estado a activo
    static activarPersona = async (req, res) => {
        await UserController.actualizarEstadoPersona(req, res, 'activo');
    };
    // Cambiar estado a bloqueado (usando 'mantenimiento' según el ENUM de tu modelo)
    static bloquearPersona = async (req, res) => {
        await UserController.actualizarEstadoPersona(req, res, 'mantenimiento');
    };
    // Eliminar Persona permanentemente
    static eliminarPersona = async (req, res) => {
        try {
            const { id_persona } = req.params;
            // Antes de eliminar la persona, elimina su foto de Supabase Storage si existe
            const perfil = await Perfil_1.default.findOne({ where: { personaId: id_persona } });
            if (perfil && perfil.foto_url) {
                // Obtener el path completo del archivo en el bucket
                // La URL pública de Supabase es algo como:
                // https://<tu-project-ref>.supabase.co/storage/v1/object/public/<bucket-name>/<path-to-file>
                // Necesitamos extraer solo el <path-to-file>
                const urlParts = perfil.foto_url.split('/');
                // El path del archivo es todo lo que viene después de '/public/<bucket-name>/'
                const pathToFile = urlParts.slice(urlParts.indexOf('public') + 2).join('/');
                if (pathToFile) {
                    // ¡IMPORTANTE! Reemplaza 'perfil-fotos' con el nombre EXACTO de tu bucket en Supabase.
                    const bucketName = 'perfil-fotos'; // <--- VERIFICA ESTE NOMBRE EN TU SUPABASE
                    const { error: deleteError } = await supabase.storage
                        .from(bucketName)
                        .remove([pathToFile]); // Usar el path completo del archivo dentro del bucket
                    if (deleteError) {
                        console.error('Error al eliminar la foto de Supabase Storage:', deleteError);
                        // No retornamos error aquí para que la eliminación de la DB continúe
                    }
                }
            }
            // Primero, eliminar el perfil asociado debido a la restricción de clave externa
            await Perfil_1.default.destroy({ where: { personaId: id_persona } });
            // Luego, eliminar la persona
            await Persona_1.default.destroy({ where: { id_persona } });
            res.status(200).json({ message: 'Usuario eliminado permanentemente.' });
        }
        catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).json({ error: 'Error interno del servidor.', details: error.message });
        }
    };
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map