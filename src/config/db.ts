import { Sequelize } from 'sequelize-typescript';
import * as path from 'path';

console.log('DEBUG DB_HOST:', process.env.SQ_HOST);
console.log('DEBUG DB_PORT:', process.env.SQ_PORT);
console.log('DEBUG DB_USER:', process.env.SQ_USER);
console.log('DEBUG DB_PASSWORD (length):', process.env.SQ_PASSWORD?.length);
console.log('DEBUG DB_NAME:', process.env.SQ_DB_NAME);
console.log('DEBUG DB_SSL:', process.env.DB_SSL);

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.SQ_HOST as string,
  port: parseInt(process.env.SQ_PORT || '5432', 10),
  username: process.env.SQ_USER as string,
  password: process.env.SQ_PASSWORD as string,
  database: process.env.SQ_DB_NAME as string,

  models: [path.join(__dirname, '/../models')],
  logging: false,

  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    family: 4, // 👈 Correctamente dentro de dialectOptions
  },

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    await sequelize.sync({ force: false });
    console.log('Modelos sincronizados con la base de datos.');
  } catch (error: any) {
    console.error('FATAL ERROR: Error durante la inicialización del servidor y la conexión a la base de datos:', error);
    throw error;
  }
}

export { sequelize, connectDB };
