import { Table, Column, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, Default, AllowNull } from 'sequelize-typescript';
import { Model } from 'sequelize-typescript'; 

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

  @Default('admin')
  @AllowNull(false)
  @Column({
  type: DataType.ENUM({ values: ['superadmin', 'admin', 'operario'] }),
  })
  declare rol: 'superadmin' | 'admin' | 'operario';

  @AllowNull(false)
  @Column(DataType.ENUM('activo', 'inactivo', 'mantenimiento'))
  declare estado: string;

  @Default(true)
  @Column({ type: DataType.BOOLEAN })
  declare autenticado: boolean;

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;
}

export default Persona;