import { Request, Response, NextFunction } from 'express';
import Persona from '../models/Persona';
import Perfil from '../models/Perfil'; 
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs'; 

dotenv.config(); 

declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            id_persona: number;
            rol: 'admin' | 'operario';
            isVerified: boolean;
        };
        file?: Express.Multer.File; 
    }
}

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY as string; 

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("ERROR FATAL: SUPABASE_URL o SUPABASE_SERVICE_KEY no están definidas en las variables de entorno.");
    process.exit(1);
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey);

export class UserController {

 
    static getAuthenticatedUserProfile = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userIdFromToken = req.user?.id_persona;

            if (!userIdFromToken) {
                return res.status(401).json({ error: 'No autenticado. ID de usuario no encontrado en el token.' });
            }

            const persona = await Persona.findByPk(userIdFromToken, {
                include: [{ model: Perfil, as: 'perfil' }] 
            });

            if (!persona) {
                return res.status(404).json({ error: 'Perfil de usuario no encontrado.' });
            }

            const personaObj = persona.toJSON();
            delete personaObj.contrasena; 
            (personaObj as any).foto_url = personaObj.perfil?.foto_url || '';

            return res.status(200).json(personaObj);

        } catch (error: any) {
            console.error('Error al obtener el perfil del usuario autenticado:', error);
            return res.status(500).json({ error: 'Error interno del servidor.', details: error.message });
        }
    };

    static updateAuthenticatedUserProfile = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userIdFromToken = req.user?.id_persona;
            const { nombre_usuario, correo, contrasena } = req.body;

            if (!userIdFromToken) {
                return res.status(401).json({ error: 'No autenticado. ID de usuario no encontrado en el token.' });
            }

            const persona = await Persona.findByPk(userIdFromToken);

            if (!persona) {
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }

            const updateFields: { nombre_usuario?: string; correo?: string; contrasena?: string } = {};

            if (nombre_usuario !== undefined) {
                updateFields.nombre_usuario = nombre_usuario;
            }
            if (correo !== undefined) {
                updateFields.correo = correo;
            }
            if (contrasena) {
                updateFields.contrasena = await bcrypt.hash(contrasena, 10);
            }

            await persona.update(updateFields);

            const perfil = await Perfil.findOne({ where: { personaId: userIdFromToken } });
            if (perfil) {
                if (nombre_usuario !== undefined) perfil.nombre_usuario = nombre_usuario;
                if (correo !== undefined) perfil.correo = correo;
                await perfil.save();
            }

            const updatedPersona = await Persona.findByPk(userIdFromToken, {
                include: [{ model: Perfil, as: 'perfil' }]
            });

            const updatedPersonaObj = updatedPersona?.toJSON();
            delete updatedPersonaObj?.contrasena;
            (updatedPersonaObj as any).foto_url = updatedPersonaObj?.perfil?.foto_url || '';


            return res.status(200).json({ message: 'Perfil actualizado correctamente.', user: updatedPersonaObj });

        } catch (error: any) {
            console.error('Error al actualizar el perfil del usuario autenticado:', error);
            return res.status(500).json({ error: 'Error interno del servidor al actualizar perfil.', details: error.message });
        }
    };



    static uploadProfilePhoto = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id_persona } = req.params; 
            const userIdFromToken = req.user?.id_persona; 

            if (req.user?.rol !== 'admin' && userIdFromToken !== parseInt(id_persona)) {
                return res.status(403).json({ error: 'Acceso denegado. No tienes permiso para actualizar esta foto de perfil.' });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'No se proporcionó ningún archivo de imagen.' });
            }

            const file = req.file;
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `profile_pictures/${id_persona}-${Date.now()}.${fileExtension}`; 

            const bucketName = 'perfil-fotos';

            const { data, error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true, 
                });

            if (uploadError) {
                console.error('Error al subir la imagen a Supabase:', uploadError);
                return res.status(500).json({ error: 'Error al subir la imagen.', details: uploadError.message });
            }

            const { data: publicUrlData } = supabase.storage
                .from(bucketName)
                .getPublicUrl(fileName);

            if (!publicUrlData || !publicUrlData.publicUrl) {
                console.error('DEBUG: publicUrlData o publicUrlData.publicUrl es nulo/indefinido.');
                return res.status(500).json({ error: 'No se pudo obtener la URL pública de la imagen.' });
            }

            const photoUrl = publicUrlData.publicUrl; 

     
            const perfil = await Perfil.findOne({ where: { personaId: id_persona } });

            if (!perfil) {
                console.warn(`Perfil no encontrado para la persona ${id_persona}. Creando uno nuevo con la foto.`);
                const persona = await Persona.findByPk(id_persona);
                if (persona) {
                    await Perfil.create({
                        personaId: persona.id_persona,
                        nombre_usuario: persona.nombre_usuario,
                        correo: persona.correo,
                        rol: persona.rol,
                        estado: persona.estado,
                        isVerified: persona.isVerified,
                        foto_url: photoUrl
                    });
                } else {
                    return res.status(404).json({ error: 'Persona no encontrada para actualizar o crear perfil con foto.' });
                }
            } else {
                perfil.foto_url = photoUrl;
                await perfil.save();
            }

            return res.status(200).json({ message: 'Foto de perfil actualizada exitosamente.', foto_url: photoUrl });

        } catch (error: any) {
            console.error('Error inesperado en uploadProfilePhoto:', error);
            return res.status(500).json({ error: 'Error interno del servidor al procesar la subida de la foto.', details: error.message });
        }
    };

    // Obtener todas las Personas (Solo Admin)
    static getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const personas = await Persona.findAll({
                include: [{ model: Perfil, as: 'perfil' }],
                order: [['id_persona', 'ASC']],
            });
      
            const personasFormatted = personas.map(p => {
                const personaObj = p.toJSON();
                delete personaObj.contrasena;
                // Añadir foto_url directamente al objeto persona para facilitar el consumo en el frontend
                (personaObj as any).foto_url = personaObj.perfil?.foto_url || '';
                return personaObj;
            });
            res.json(personasFormatted);
        } catch (error: any) {
            console.error('Error al obtener todas las personas:', error);
            res.status(500).json({ error: 'Error al obtener personas', details: error.message });
        }
    };

    // Obtener Personas Activas y Verificadas (Solo Admin)
    static getAllActivos = async (req: Request, res: Response): Promise<void> => {
        try {
            const personas = await Persona.findAll({
                where: {
                    estado: 'activo',
                    isVerified: true
                },
                include: [{ model: Perfil, as: 'perfil' }],
                order: [['id_persona', 'ASC']],
            });
            // Eliminar la contraseña y añadir foto_url al nivel superior antes de enviar la respuesta
            const personasFormatted = personas.map(p => {
                const personaObj = p.toJSON();
                delete personaObj.contrasena;
                (personaObj as any).foto_url = personaObj.perfil?.foto_url || '';
                return personaObj;
            });
            res.status(200).json(personasFormatted);
        } catch (error: any) {
            console.error('Error al obtener perfiles activos:', error);
            res.status(500).json({ error: 'Error interno del servidor.', details: error.message });
        }
    }

    // Mostrar Persona por ID (Solo Admin o el propio usuario si es su ID)
    static getById = async (req: Request, res: Response): Promise<void> => {
        const { id_persona } = req.params;
        try {
            const persona = await Persona.findByPk(id_persona, {
                include: [{ model: Perfil, as: 'perfil' }]
            });
            if (!persona) {
                res.status(404).json({ error: 'Persona no encontrada' });
                return;
            }

            const personaObj = persona.toJSON();
            delete personaObj.contrasena; 
            (personaObj as any).foto_url = personaObj.perfil?.foto_url || ''; 

            res.status(200).json(personaObj);
        } catch (error: any) {
            console.error('Error al obtener persona por ID:', error);
            res.status(500).json({ error: 'Error interno del servidor.', details: error.message });
        }
    };

    // Actualizar Persona (Solo Admin)
    static update = async (req: Request, res: Response): Promise<void> => {
        const { id_persona } = req.params;
        const { nombre_usuario, correo, contrasena, rol, estado, isVerified } = req.body;
        try {
            const persona = await Persona.findByPk(id_persona);
            if (!persona) {
                res.status(404).json({ error: 'Persona no encontrada' });
                return;
            }

            const updateFields: any = {};
            if (nombre_usuario !== undefined) updateFields.nombre_usuario = nombre_usuario;
            if (correo !== undefined) updateFields.correo = correo;
            if (rol !== undefined) updateFields.rol = rol;
            if (estado !== undefined) updateFields.estado = estado;
            if (isVerified !== undefined) updateFields.isVerified = isVerified;
            if (contrasena) {
                updateFields.contrasena = await bcrypt.hash(contrasena, 10);
            }

            await persona.update(updateFields);

            // También actualiza los campos relevantes en la tabla de Perfil si es necesario
            const perfil = await Perfil.findOne({ where: { personaId: id_persona } });
            if (perfil) {
                if (nombre_usuario !== undefined) perfil.nombre_usuario = nombre_usuario;
                if (correo !== undefined) perfil.correo = correo;
                await perfil.save();
            }


            res.status(200).json({ message: 'Persona actualizada correctamente', persona });
        } catch (error: any) {
            console.error('Error al actualizar persona:', error);
            res.status(500).json({ error: 'Error interno del servidor.', details: error.message });
        }
    };

    // Eliminar Persona (Solo Admin)
    static delete = async (req: Request, res: Response): Promise<void> => {
        const { id_persona } = req.params;
        try {
            const persona = await Persona.findByPk(id_persona);
            if (!persona) {
                res.status(404).json({ error: 'Persona no encontrada' });
                return;
            }
            await persona.destroy();
            res.status(200).json({ message: 'Persona eliminada correctamente' });
        } catch (error: any) {
            console.error('Error al eliminar persona:', error);
            res.status(500).json({ error: 'Error interno del servidor.', details: error.message });
        }
    };
}
