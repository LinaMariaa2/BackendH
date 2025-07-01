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

@Table({ tableName: 'tbl_gestion_cultivos', timestamps: true })
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
}

export default GestionCultivo;