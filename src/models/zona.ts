import {
  Table, Column, Model, DataType, PrimaryKey, AutoIncrement,
  CreatedAt, UpdatedAt, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { Invernadero } from './invernadero';
import { GestionCultivo } from './gestionarCultivos';

@Table({ tableName: 'tbl_zona', timestamps: true })
export class Zona extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id_zona: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare nombre: string;

  @Column(DataType.TEXT)
  declare descripciones_add?: string;

  @ForeignKey(() => Invernadero)
  @Column(DataType.INTEGER)
  declare id_invernadero: number;

  @BelongsTo(() => Invernadero)
  declare invernadero: Invernadero;

  @Column({
    type: DataType.ENUM('activo', 'inactivo', 'mantenimiento'),
    allowNull: false,
    defaultValue: 'activo',
  })
  declare estado: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;
}
export default Zona;