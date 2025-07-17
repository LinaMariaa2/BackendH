// Para el manejo de imagenes en gestion de cultivos y otras interacciones con Supabase.
// En la base de datos se guarda el link y en Supabase Storage las imágenes en la nube.

import { createClient } from '@supabase/supabase-js';

// **ADVERTENCIA DE SEGURIDAD:**
// La SUPABASE_SERVICE_KEY es una clave de superusuario y NUNCA debe ser expuesta en el frontend.
// Solo debe usarse en el backend.
// La SUPABASE_URL es pública y puede estar aquí o en .env.

const supabaseUrl = process.env.SUPABASE_URL || 'https://yasjwniajgvwkrxyyfrm.supabase.co'; // Lee la URL desde .env o usa un valor por defecto
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // ¡Lee desde .env!

if (!supabaseServiceKey) {
    console.error("ERROR FATAL: La variable de entorno SUPABASE_SERVICE_KEY no está definida.");
    console.error("Asegúrate de tener un archivo .env en la raíz de tu proyecto backend con esta variable.");
    process.exit(1); 
}

// Crea y exporta el cliente de Supabase usando la Service Role Key para operaciones de backend
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('DEBUG: Cliente de Supabase inicializado con Service Role Key.');
//s