import { Sequelize } from 'sequelize-typescript';
import * as path from 'path';

// --- DEBUG: Mostrar variables de entorno importantes ---
console.log('DEBUG DB_HOST:', process.env.DB_HOST);
console.log('DEBUG DB_PORT:', process.env.DB_PORT);
console.log('DEBUG DB_USER:', process.env.DB_USER);
console.log('DEBUG DB_PASSWORD (length):', process.env.DB_PASSWORD?.length);
console.log('DEBUG DB_NAME:', process.env.DB_NAME);

// --- Sequelize ---
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST as string, // ejemplo: db.yasjwniajgvwkrxyyfrm.supabase.co
  port: parseInt(process.env.DB_PORT || '6543', 10), // puerto del pooler de transacciones
  username: process.env.DB_USER as string, // usualmente 'postgres'
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,

  models: [path.join(__dirname, '/../models')],
  logging: false,

  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Supabase no usa CA pública
    },
    family: 4, // 👈 Fuerza IPv4 (necesario para evitar errores en algunas redes)
  },

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Función para conectar y sincronizar modelos
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    await sequelize.sync({ force: false }); // cambiar a 'true' solo si quieres reiniciar los datos
    console.log('✅ Modelos sincronizados con la base de datos.');
  } catch (error: any) {
    console.error('❌ FATAL ERROR: No se pudo conectar a la base de datos:', error);
    throw error;
  }
}

export { sequelize, connectDB };
