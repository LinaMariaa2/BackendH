// src/controllers/UserController.ts
import type { Request, Response } from 'express';
import Persona from '../models/Persona'; 
import bcrypt from 'bcryptjs';
import { AuthController } from './AuthController'; 

export class UserController {

    
    private static cleanPersonaData = (persona: Persona) => {
        const personaJson = persona.toJSON();
        delete personaJson.contrasena; 
        delete personaJson.verificationCode;
        delete personaJson.verificationCodeExpires; 
        delete personaJson.intentos;
        return personaJson;
    };


    // 1. Get all Personas
    static getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const personas = await Persona.findAll({
                order: [['id_persona', 'ASC']],
            });
            // Clean sensitive fields from each person before sending the response
            res.json(personas.map(UserController.cleanPersonaData));
        } catch (error: any) {
            console.error('Error getting persons:', error);
            res.status(500).json({ error: 'Error getting persons', details: error.message });
        }
    };

    // 2. Get Active y Verificar Personas
    static getAllActivos = async (req: Request, res: Response): Promise<void> => {
        try {
            const personas = await Persona.findAll({
                where: { estado: 'activo', isVerified: true },
                order: [['id_persona', 'ASC']],
            });
            res.json(personas.map(UserController.cleanPersonaData));
        } catch (error: any) {
            console.error('Error getting active/verified persons:', error);
            res.status(500).json({
                error: 'Error getting all active/verified persons',
                details: error.message,
            });
        }
    };

    // 3. Persona por ID
    static getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id_persona } = req.params;
            const persona = await Persona.findByPk(id_persona);
            if (!persona) {
                res.status(404).json({ error: 'Person not found, are you sure it exists?' });
                return;
            }
            res.json(UserController.cleanPersonaData(persona));
        } catch (error: any) {
            console.error('Error getting person by ID:', error);
            res.status(500).json({ error: 'Error getting person', details: error.message });
        }
    };

    // 4. actualizar persona desde admin

    static actualizarPersona = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id_persona } = req.params;
            const { contrasena, intentos, ...updateData } = req.body;

            const persona = await Persona.findByPk(id_persona);
            if (!persona) {
                res.status(404).json({ error: 'Person not found' });
                return;
            }

            // si se ingrega una contraseña debe ser hasheada
            if (contrasena) {
                updateData.contrasena = await bcrypt.hash(contrasena, 10);
            }

            // si el correo es diferente al original deve ser verificado
            if (updateData.correo && updateData.correo !== persona.correo) {
                updateData.isVerified = false;
                updateData.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
                updateData.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // el codigo expira en 10 minutos
               
                const tempPersonaForEmail = { ...persona.toJSON(), ...updateData } as Persona;
                await AuthController.sendVerificationCode(tempPersonaForEmail);
            }

            // se aplica las actualizaciones de persona en la base de datos
            await persona.update(updateData);

            res.json({ message: 'Person updated successfully', persona: UserController.cleanPersonaData(persona) });

        } catch (error: any) {
            console.error('Error updating person:', error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                res.status(409).json({ error: 'The email address is already registered. Please use another.', details: error.message });
                return;
            }
            if (error.name === 'SequelizeValidationError') {
                res.status(400).json({ error: 'Invalid person data', details: error.errors.map((e: any) => e.message) });
                return;
            }
            res.status(500).json({
                error: 'Error updating person',
                details: error instanceof Error ? error.message : String(error),
            });
        }
    };

    // 5. Inactivar persona
    static inactivarPersona = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id_persona } = req.params;
            const persona = await Persona.findByPk(id_persona);

            if (!persona) {
                res.status(404).json({ error: 'Person not found' });
                return;
            }

            persona.estado = 'inactivo';
            await persona.save();

            res.json({ message: 'Person inactivated successfully', persona: UserController.cleanPersonaData(persona) });
        } catch (error: any) {
            console.error('Error inactivating person:', error);
            res.status(500).json({
                error: 'Error inactivating person',
                details: error.message,
            });
        }
    };

    // 6. Activar persona
    static activarPersona = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id_persona } = req.params;
            const persona = await Persona.findByPk(id_persona);

            if (!persona) {
                res.status(404).json({ error: 'Person not found' });
                return;
            }

            persona.estado = 'activo';
            persona.intentos = 0; 
            await persona.save();

            res.json({ message: 'Person activated successfully', persona: UserController.cleanPersonaData(persona) });
        } catch (error: any) {
            console.error('Error activating person:', error);
            res.status(500).json({
                error: 'Error activating person',
                details: error.message,
            });
        }
    };

    // 7. Bloquear a Persona
    static bloquearPersona = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id_persona } = req.params;
            const persona = await Persona.findByPk(id_persona);

            if (!persona) {
                res.status(404).json({ error: 'Person not found' });
                return;
            }

            persona.estado = 'bloqueado';
            persona.intentos = 0;
            await persona.save();

            res.json({ message: 'Person blocked successfully', persona: UserController.cleanPersonaData(persona) });
        } catch (error: any) {
            console.error('Error blocking person:', error);
            res.status(500).json({
                error: 'Error blocking person',
                details: error.message,
            });
        }
    };
//eliminar persona
    static eliminarPersona = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id_persona } = req.params;
            const persona = await Persona.findByPk(id_persona);

            if (!persona) {
                res.status(404).json({ error: 'Person not found' });
                return;
            }

            await persona.destroy(); 
            res.json({ message: 'Person permanently deleted' });
        } catch (error: any) {
            console.error('Error deleting person:', error);
            res.status(500).json({
                error: 'Error deleting person',
                details: error.message,
            });
        }
    };
}
