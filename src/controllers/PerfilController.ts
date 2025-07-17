import { Request, Response, NextFunction } from 'express';
import Perfil from '../models/Perfil';
import Persona from '../models/Persona';
import * as bcrypt from 'bcryptjs';

// Extendemos la interfaz Request de Express para añadir nuestra propiedad 'user'
declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            id_persona: number;
            rol: 'admin' | 'operario';
            isVerified: boolean;
        };
    }
}

// Función para obtener el perfil del usuario autenticado
export const getOwnPerfil = async (req: Request, res: Response) => {
    try {
        // Asegurarse de que el usuario esté autenticado y su ID esté disponible
        if (!req.user || typeof req.user.id_persona !== 'number') { // Verificar tipo también
            console.error('DEBUG: getOwnPerfil - No autenticado o ID de usuario no disponible en req.user.');
            return res.status(401).json({ error: 'No autenticado o ID de usuario no disponible.' });
        }

        const id_persona = req.user.id_persona; // Obtener el ID de la persona del token JWT
        console.log('DEBUG: getOwnPerfil - Intentando obtener perfil para id_persona:', id_persona);

        const persona = await Persona.findByPk(id_persona, {
            include: [{ model: Perfil, as: 'perfil' }] // Incluir el perfil asociado
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
            perfilAsociado = await Perfil.create({
                personaId: persona.id_persona,
                nombre_usuario: persona.nombre_usuario,
                correo: persona.correo,
                rol: persona.rol,
                estado: persona.estado,
                isVerified: persona.isVerified,
                foto_url: '' // Valor por defecto vacío
            });
            // Actualizar el objeto persona para que incluya el nuevo perfil
            (persona as any).perfil = perfilAsociado;
            console.log('DEBUG: getOwnPerfil - Nuevo perfil creado y asociado.');
        } else {
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

    } catch (err: any) {
        console.error('DEBUG: getOwnPerfil - Error durante la operación:', err);
        return res.status(500).json({ error: 'Error interno del servidor al obtener el perfil.', details: err.message });
    }
};


// Función para actualizar el perfil del usuario autenticado
export const actualizarPerfil = async (req: Request, res: Response) => {
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
        const persona = await Persona.findByPk(id_persona_from_token);
        console.log('DEBUG: actualizarPerfil - Resultado de Persona.findByPk:', persona ? 'Encontrada' : 'NO ENCONTRADA');

        const perfil = await Perfil.findOne({ where: { personaId: id_persona_from_token } });
        console.log('DEBUG: actualizarPerfil - Resultado de Perfil.findOne:', perfil ? 'Encontrado' : 'NO ENCONTRADO');


        if (!persona || !perfil) {
            console.error('DEBUG: actualizarPerfil - Usuario o perfil NO encontrado para id_persona:', id_persona_from_token);
            return res.status(404).json({ error: 'Usuario o perfil no encontrado.' });
        }

        // Actualizar datos de Persona
        if (nombre_usuario !== undefined) persona.nombre_usuario = nombre_usuario;
        if (correo !== undefined) persona.correo = correo;
        if (contrasena) {
            // Hashear la nueva contraseña si se proporciona
            persona.contrasena = await bcrypt.hash(contrasena, 10);
        }
        await persona.save();
        console.log('DEBUG: actualizarPerfil - Persona guardada.');


        // Actualizar datos de Perfil
        if (nombre_usuario !== undefined) perfil.nombre_usuario = nombre_usuario;
        if (correo !== undefined) perfil.correo = correo;
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

    } catch (err: any) {
        console.error('DEBUG: actualizarPerfil - Error durante la operación:', err);
        // Manejo de errores específicos, como violación de unicidad de correo
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'El correo electrónico ya está en uso.', details: err.message });
        }
        return res.status(500).json({ error: 'Error interno del servidor al actualizar el perfil.', details: err.message });
    }
};
