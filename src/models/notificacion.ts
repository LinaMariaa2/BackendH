import { Table, Column, Model, DataType } from 'sequelize-typescript';

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
    type: DataType.ENUM("alerta", "riego", "iluminacion", "cultivo", "sistema"),
    allowNull: false,
  })
  declare tipo: "alerta" | "riego" | "iluminacion" | "cultivo" | "sistema";

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
