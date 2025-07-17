import { Model } from 'sequelize-typescript';
import { Persona } from './Persona';
import { Zona } from './zona';
export declare class Invernadero extends Model {
    id_invernadero: number;
    nombre: string;
    descripcion: string;
    estado: 'activo' | 'inactivo' | 'mantenimiento';
    zonas_totales: number;
    zonas_activas: number;
    responsable_id: number;
    persona: Persona;
    zonas: Zona[];
    createdAt: Date;
    updatedAt: Date;
}
export default Invernadero;
