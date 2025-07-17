import { Table, Column, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, Default, AllowNull, HasOne } from 'sequelize-typescript';
import { Model } from 'sequelize-typescript'; 
import Perfil from './Perfil'; // Importa el modelo Perfil para la relación

@Table({ tableName: 'tbl_persona', timestamps: true })
export class Persona extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id_persona: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(50) })
  declare nombre_usuario: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(100), unique: true })
  declare correo: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(255) }) 
  declare contrasena: string;

  @Default('operario')
  @AllowNull(false)
  @Column({
    type: DataType.ENUM({ values: ['admin', 'operario'] }),
  })
  declare rol: 'admin' | 'operario';

  @AllowNull(false)
  @Column(DataType.ENUM('activo', 'inactivo', 'mantenimiento'))
  declare estado: string;

  @Default(false) 
  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN })
  declare isVerified: boolean; 

  @AllowNull(true)
  @Column({ type: DataType.STRING(6) })
  declare verificationCode: string | null; 

  @AllowNull(true) 
  @Column({ type: DataType.DATE })
  declare verificationCodeExpires: Date | null; 

  @Default(0) 
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  declare intentos: number;

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;

  // Define la relación uno a uno con Perfil
  @HasOne(() => Perfil, { foreignKey: 'personaId', as: 'perfil' }) 
  declare perfil: Perfil; 
}

export default Persona;
