//Para el manejo de imagenes en gestion de cultivos
//En la db se guarda link y en supabase storage las imagenes en la nube
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://yasjwniajgvwkrxyyfrm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhc2p3bmlhamd2d2tyeHl5ZnJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNzMyNTcsImV4cCI6MjA2NjY0OTI1N30.wbH1vMy-grNy2IPkpgMVZKQPIFELhicXsV7OwVUP0BQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
