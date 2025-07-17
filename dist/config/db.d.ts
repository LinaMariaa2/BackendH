import { Sequelize } from 'sequelize-typescript';
declare const sequelize: Sequelize;
declare function connectDB(): Promise<void>;
export { sequelize, connectDB };
