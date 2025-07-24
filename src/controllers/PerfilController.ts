import { Request, Response, NextFunction } from 'express';
import Perfil from '../models/Perfil';
import Persona from '../models/Persona';
import * as bcrypt from 'bcryptjs';

declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            id_persona: number;
            rol: 'admin' | 'operario';
            isVerified: boolean;
        };
    }
}

export const getOwnPerfil = async (req: Request, res: Response) => {
    try {
        if (!req.user || typeof req.user.id_persona !== 'number') {
            return res.status(401).json({ error: 'No autenticado o ID de usuario no disponible.' });
        }

        const id_persona = req.user.id_persona;

        const persona = await Persona.findByPk(id_persona, {
            include: [{ model: Perfil, as: 'perfil' }]
        });

        if (!persona) {
            return res.status(404).json({ error: 'Perfil de usuario no encontrado.' });
        }

        let perfilAsociado = persona.perfil;
        if (!perfilAsociado) {
            perfilAsociado = await Perfil.create({
                personaId: persona.id_persona,
                nombre_usuario: persona.nombre_usuario,
                correo: persona.correo,
                rol: persona.rol,
                estado: persona.estado,
                isVerified: persona.isVerified,
                foto_url: ''
            });
            (persona as any).perfil = perfilAsociado;
        }

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
            perfil: perfilAsociado
        });

    } catch (err: any) {
        return res.status(500).json({ error: 'Error interno del servidor al obtener el perfil.', details: err.message });
    }
};

export const actualizarPerfil = async (req: Request, res: Response) => {
    try {
        if (!req.user || typeof req.user.id_persona !== 'number') {
            return res.status(401).json({ error: 'No autenticado o ID de usuario no disponible.' });
        }

        const id_persona_from_token = req.user.id_persona;
        const { nombre_usuario, correo, contrasena } = req.body;

        const persona = await Persona.findByPk(id_persona_from_token);

        const perfil = await Perfil.findOne({ where: { personaId: id_persona_from_token } });

        if (!persona || !perfil) {
            return res.status(404).json({ error: 'Usuario o perfil no encontrado.' });
        }

        if (nombre_usuario !== undefined) persona.nombre_usuario = nombre_usuario;
        if (correo !== undefined) persona.correo = correo;
        if (contrasena) {
            persona.contrasena = await bcrypt.hash(contrasena, 10);
        }
        await persona.save();

        if (nombre_usuario !== undefined) perfil.nombre_usuario = nombre_usuario;
        if (correo !== undefined) perfil.correo = correo;
        await perfil.save();

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
                foto_url: perfil.foto_url
            }
        });

    } catch (err: any) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'El correo electrónico ya está en uso.', details: err.message });
        }
        return res.status(500).json({ error: 'Error interno del servidor al actualizar el perfil.', details: err.message });
    }
};
