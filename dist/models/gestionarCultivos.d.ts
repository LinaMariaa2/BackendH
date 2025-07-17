import { Model } from 'sequelize-typescript';
import Zona from './zona';
export declare class GestionCultivo extends Model {
    id_cultivo: number;
    nombre_cultivo: string;
    descripcion: string;
    temp_min: number;
    temp_max: number;
    humedad_min: number;
    humedad_max: number;
    fecha_inicio: Date;
    fecha_fin?: Date;
    estado: string;
    imagenes: string;
    id_zona: number | null;
    zona?: Zona;
    createdAt: Date;
    updatedAt: Date;
}
export default GestionCultivo;
