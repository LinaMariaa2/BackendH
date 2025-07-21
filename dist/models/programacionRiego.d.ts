import { Model } from 'sequelize-typescript';
import Zona from './zona';
export declare class ProgramacionRiego extends Model {
    id_pg_riego: number;
    fecha_inicio: Date;
    fecha_finalizacion: Date;
    descripcion: string;
    tipo_riego: 'goteo' | 'aspersión' | 'Manual';
    id_zona: number;
    zona: Zona;
    createdAt: Date;
    updatedAt: Date;
}
export default ProgramacionRiego;
