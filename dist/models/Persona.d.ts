import { Model } from 'sequelize-typescript';
export declare class Persona extends Model {
    id_persona: number;
    nombre_usuario: string;
    correo: string;
    contrasena: string;
    rol: 'admin' | 'operario';
    estado: string;
    isVerified: boolean;
    verificationCode: string | null;
    verificationCodeExpires: Date | null;
    intentos: number;
    createdAt: Date;
    updatedAt: Date;
}
export default Persona;
