"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCultivoImage = void 0;
const supabaseClient_1 = require("../config/supabaseClient");
const uploadCultivoImage = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            res.status(400).json({ error: 'No se envió ninguna imagen' });
            return;
        }
        const nombreArchivo = `cultivos/${Date.now()}_${file.originalname}`;
        // const nombreArchivo = `${Date.now()}_${file.originalname}`;
        const { data, error } = await supabaseClient_1.supabase.storage
            .from('cultivos') // Cambia por tu bucket real
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
    }
    catch (error) {
        console.error('Error en el controlador:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
exports.uploadCultivoImage = uploadCultivoImage;
//# sourceMappingURL=imagenController.js.map