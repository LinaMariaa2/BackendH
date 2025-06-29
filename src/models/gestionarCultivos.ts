import {
  Table, Column, Model, DataType, PrimaryKey, AutoIncrement,
  ForeignKey, BelongsTo, CreatedAt, UpdatedAt
} from 'sequelize-typescript';
import { Zona } from './zona';
import { Invernadero } from './invernadero';

@Table({ tableName: 'tbl_gestion_cultivos', timestamps: true })
export class GestionCultivo extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id_cultivo: number;

  @Column(DataType.STRING)
  declare nombre_cultivo: string;

  @Column(DataType.TEXT)
  declare descripcion?: string;

  @Column(DataType.DECIMAL)
  declare temp_min: number;

  @Column(DataType.DECIMAL)
  declare temp_max: number;

  @Column(DataType.DECIMAL)
  declare humedad_min: number;

  @Column(DataType.DECIMAL)
  declare humedad_max: number;

  @ForeignKey(() => Zona)
  @Column(DataType.INTEGER)
  declare id_zona: number;

  @BelongsTo(() => Zona)
  declare zona: Zona;

  @ForeignKey(() => Invernadero)
  @Column(DataType.INTEGER)
  declare id_invernadero: number;

  @BelongsTo(() => Invernadero)
  declare invernadero: Invernadero;

  @Column(DataType.DATEONLY)
  declare fecha_inicio: Date;

  @Column(DataType.DATEONLY)
  declare fecha_fin?: Date;

  @Column({
    type: DataType.ENUM('activo', 'inactivo', 'mantenimiento'),
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
export default GestionCultivo;