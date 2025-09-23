import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey } from 'sequelize-typescript';
import Persona from './Persona';

@Table({ tableName: 'tbl_notificacion', timestamps: false })
export class Notificacion extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id_notificacion: number;

  @ForeignKey(() => Persona)
  @Column(DataType.INTEGER)
  declare id_persona: number;

  @Column(DataType.TEXT)
  declare titulo: string;

  @Column(DataType.TEXT)
  declare mensaje: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare leido: boolean;

  @Column({ type: DataType.DATE, field: 'timestamp_envio', defaultValue: DataType.NOW })
  declare timestamp_envio: Date;
}
export default Notificacion;