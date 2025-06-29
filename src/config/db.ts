import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv'; // variables de entorno
import path from 'path';


dotenv.config();

const sequelize = new Sequelize({
  database: process.env.SQ_NAME as string,
  username: process.env.SQ_USER as string,
  password: process.env.SQ_PASSWORD as string,
  host: process.env.SQ_HOST as string,
  port: parseInt(process.env.SQ_PORT as string, 10),
  dialect: 'postgres',
  models: [path.resolve(__dirname, '..', 'models', '**/*.ts')],
  logging: false, //para evitar tener tanto texto en la ocnsole
  dialectOptions: {
    ssl: { // necesarios para permisos con supabase
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
 
  
});


export default sequelize;