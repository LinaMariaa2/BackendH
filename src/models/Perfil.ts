import { Table, Column, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, AllowNull, ForeignKey, BelongsTo, Default } from 'sequelize-typescript';
import { Model } from 'sequelize-typescript';
import Persona from './Persona';

@Table({ tableName: 'tbl_perfil', timestamps: true }) 
export class Perfil extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id_perfil: number;

  @ForeignKey(() => Persona)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER, onDelete: 'CASCADE' })
  declare personaId: number;

  @BelongsTo(() => Persona)
  declare persona: Persona;

  @AllowNull(false)
  @Column({ type: DataType.STRING(50) })
  declare nombre_usuario: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(100) })
  declare correo: string;

  @Default('activo')
  @AllowNull(false)
  @Column(DataType.ENUM('activo', 'inactivo', 'mantenimiento'))
  declare estado: string;

  @Default('')
  @AllowNull(true)
  @Column({ type: DataType.STRING })
  declare foto_url: string; // Campo para guardar la URL de la foto de perfil

  @Default(false)
  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN })
  declare isVerified: boolean;

  @AllowNull(false)
  @Column(DataType.ENUM('admin', 'operario'))
  declare rol: 'admin' | 'operario';

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;
}

export default Perfil;