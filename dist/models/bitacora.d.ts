import { Model } from 'sequelize-typescript';
import { Invernadero } from './invernadero';
import { Zona } from './zona';
import { Persona } from './Persona';
export declare class Bitacora extends Model {
    id_publicacion: number;
    titulo: string;
    contenido: string;
    importancia: 'alta' | 'media' | 'baja';
    tipo_evento: 'riego' | 'iluminacion' | 'cultivo' | 'alerta' | 'mantenimiento' | 'hardware' | 'general';
    id_invernadero: number;
    invernadero: Invernadero;
    id_zona: number;
    zona: Zona;
    autor_id: number;
    autor: Persona;
    archivada: boolean;
    timestamp_publicacion: Date;
    createdAt: Date;
    updatedAt: Date;
}
export default Bitacora;
