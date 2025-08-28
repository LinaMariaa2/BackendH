import {
  Table, Column, DataType, PrimaryKey, AutoIncrement, ForeignKey,
  Model, CreatedAt, UpdatedAt, AllowNull, BelongsTo, Default
} from 'sequelize-typescript';
import Zona from './zona';

@Table({ tableName: 'tbl_lectura_sensor', timestamps: true })
export class LecturaSensor extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id_lectura: number;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  declare id_sensor: number;

  @AllowNull(false)
  @Column({ type: DataType.DECIMAL(6, 2) })
  declare valor: number;

  @AllowNull(true)
  @Column({ type: DataType.STRING(10) })
  declare unidad: string;

  @AllowNull(true)
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE })
  declare timestamp_lectura: Date;

  @ForeignKey(() => Zona)
  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  declare id_zona: number;

  @BelongsTo(() => Zona)
  declare zona: Zona;

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;
}

export default LecturaSensor;
