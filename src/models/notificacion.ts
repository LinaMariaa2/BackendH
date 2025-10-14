import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { Visita } from './visita';

@Table({
  tableName: 'notificaciones',
  timestamps: false,
})
export class Notificacion extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.ENUM(
      "alerta", "riego", "iluminacion", "cultivo", "sistema",
      "alerta_hardware", "alerta_sensor", "info_sensor",
      "visita", "inicio_riego", "fin_riego",
      "iluminacion_inicio", "iluminacion_fin"
    ),
    allowNull: false,
  })
  declare tipo:
    | "alerta"
    | "riego"
    | "iluminacion"
    | "cultivo"
    | "sistema"
    | "alerta_hardware"
    | "alerta_sensor"
    | "info_sensor"
    | "visita"
    | "inicio_riego"
    | "fin_riego"
    | "iluminacion_inicio"
    | "iluminacion_fin";

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare titulo: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare mensaje: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  declare timestamp: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare leida: boolean;

}

export default Notificacion;
