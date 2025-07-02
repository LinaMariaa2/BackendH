import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
  AllowNull
} from 'sequelize-typescript';
import Zona from './zona';
import Invernadero from './invernadero';

@Table({ tableName: 'tbl_gestion_cultivos'})
export class GestionCultivo extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id_cultivo: number;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare nombre_cultivo: string;

  @Column(DataType.TEXT)
  declare descripcion: string;

  @Column(DataType.FLOAT)
  declare temp_min: number;

  @Column(DataType.FLOAT)
  declare temp_max: number;

  @Column(DataType.FLOAT)
  declare humedad_min: number;

  @Column(DataType.FLOAT)
  declare humedad_max: number;

  @Column(DataType.DATE)
  declare fecha_inicio: Date;

  @Column(DataType.DATE)
  declare fecha_fin: Date;

  @Column(DataType.ENUM('activo', 'finalizado'))
  declare estado: string;

  @ForeignKey(() => Zona)
  @Column
  declare id_zona: number;

  @BelongsTo(() => Zona)
  declare zona: Zona;

  @CreatedAt
  @Column({ field: 'created_at' }) // si quieres el nombre en snake_case
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;

}

export default GestionCultivo;