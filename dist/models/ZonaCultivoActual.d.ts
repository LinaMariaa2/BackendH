import { Model } from 'sequelize-typescript';
import Zona from './zona';
import GestionCultivo from './gestionarCultivos';
export declare class ZonaCultivoActual extends Model {
    id_zona: number;
    id_cultivo: number;
    zona: Zona;
    cultivo: GestionCultivo;
    createdAt: Date;
    updatedAt: Date;
}
export default ZonaCultivoActual;
