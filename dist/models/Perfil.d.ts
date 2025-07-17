import { Model } from 'sequelize-typescript';
import Persona from './Persona';
export declare class Perfil extends Model {
    id_perfil: number;
    personaId: number;
    persona: Persona;
    nombre_usuario: string;
    correo: string;
    estado: string;
    foto_url: string;
    isVerified: boolean;
    rol: 'admin' | 'operario';
    createdAt: Date;
    updatedAt: Date;
}
export default Perfil;
