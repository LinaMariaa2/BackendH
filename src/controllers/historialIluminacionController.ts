// src/controllers/historialIluminacionController.ts
import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';

export const getAllIluminacion = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('tbl_historial_iluminacion')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error al obtener historial de iluminación:', error.message);
            res.status(500).json({ 
                message: 'Error al obtener historial de iluminación desde la base de datos',
                error: error.message
            });
            return; 
        }

        if (!data || data.length === 0) {
            res.status(200).json({ message: 'No hay historial de iluminación disponible', data: [] }); // <-- QUITADO 'return'
            return; 
        }

        res.status(200).json(data); 
    } catch (err: any) {
        console.error('Error inesperado en getAllIluminacion:', err.message);
        res.status(500).json({
            message: 'Error interno del servidor al procesar el historial de iluminación',
            error: err.message
        });
    }
};