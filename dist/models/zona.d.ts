import { Model } from 'sequelize-typescript';
import { Invernadero } from './invernadero';
import { GestionCultivo } from './gestionarCultivos';
import { ZonaCultivoActual } from './ZonaCultivoActual';
export declare class Zona extends Model {
    id_zona: number;
    nombre: string;
    descripciones_add: string;
    estado: string;
    id_invernadero: number;
    invernadero: Invernadero;
    cultivos: GestionCultivo[];
    cultivoActual: ZonaCultivoActual;
    createdAt: Date;
    updatedAt: Date;
}
export default Zona;
