import { Model } from 'sequelize-typescript';
import { Invernadero } from './invernadero';
import { GestionCultivo } from './gestionarCultivos';
export declare class Zona extends Model {
    id_zona: number;
    nombre: string;
    descripciones_add: string;
    estado: string;
    id_invernadero: number;
    invernadero: Invernadero;
    id_cultivo: number | null;
    cultivo: GestionCultivo;
    createdAt: Date;
    updatedAt: Date;
}
export default Zona;
