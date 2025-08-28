// src/models/HistorialRiego.ts
import { Table, Column, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, ForeignKey, AllowNull, Model } from 'sequelize-typescript';
import ProgramacionRiego from './programacionRiego'; 
import Zona from './zona';

@Table({
  tableName: 'tbl_historial_riego',
  timestamps: true, // usaremos CreatedAt y UpdatedAt
})
export default class HistorialRiego extends Model {
  
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  id_historial_riego!: number;

  @ForeignKey(() => ProgramacionRiego)
  @AllowNull(false)
  
  @Column({ type: DataType.INTEGER })
  id_pg_riego!: number;

  @ForeignKey(() => Zona)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  id_zona!: number;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  duracion_minutos!: number;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  fecha_activacion!: Date; 

  @CreatedAt
  fecha_creacion!: Date;

  @UpdatedAt
  fecha_actualizacion!: Date;
}
