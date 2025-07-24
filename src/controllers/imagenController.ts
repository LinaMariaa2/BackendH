// src/controllers/uploadController.ts
import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';

export const uploadCultivoImage = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'No se envió ninguna imagen' });
      return ;
    }

    const nombreArchivo = `cultivos/${Date.now()}_${file.originalname}`; 

   


    const { data, error } = await supabase.storage
      .from('cultivos') 
      .upload(nombreArchivo, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      console.error('Error al subir imagen a Supabase:', error);
      res.status(500).json({ error: 'Error al subir imagen' });
      return;
    }

    // Construimos la URL pública
    const publicUrl = `https://yasjwniajgvwkrxyyfrm.supabase.co/storage/v1/object/public/cultivos/${nombreArchivo}`;


    res.status(200).json({ url: publicUrl });
  } catch (error) {
    console.error('Error en el controlador:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
