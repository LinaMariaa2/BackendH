import { Model } from 'sequelize-typescript';
import Zona from './zona';
export declare class ProgramacionIluminacion extends Model {
    id_iluminacion: number;
    fecha_inicio: Date;
    fecha_finalizacion: Date;
    descripcion: string;
    id_zona: number;
    zona: Zona;
    createdAt: Date;
    updatedAt: Date;
}
export default ProgramacionIluminacion;
