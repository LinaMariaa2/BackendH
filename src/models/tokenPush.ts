import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey } from 'sequelize-typescript';
import Persona from './Persona'; // Se asume que tienes un modelo Persona

@Table({ tableName: 'tbl_token_push', timestamps: true, createdAt: 'created_at', updatedAt: 'actualizado' })
export class TokenPush extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id_token: number;

  @ForeignKey(() => Persona)
  @Column(DataType.INTEGER)
  declare id_persona: number;

  @Column(DataType.TEXT)
  declare token: string;

  @Column(DataType.STRING)
  declare plataforma: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare activo: boolean;
}
export default TokenPush;