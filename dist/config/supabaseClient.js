"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
//Para el manejo de imagenes en gestion de cultivos
//En la db se guarda link y en supabase storage las imagenes en la nube
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = 'https://yasjwniajgvwkrxyyfrm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhc2p3bmlhamd2d2tyeHl5ZnJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNzMyNTcsImV4cCI6MjA2NjY0OTI1N30.wbH1vMy-grNy2IPkpgMVZKQPIFELhicXsV7OwVUP0BQ';
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
//# sourceMappingURL=supabaseClient.js.map