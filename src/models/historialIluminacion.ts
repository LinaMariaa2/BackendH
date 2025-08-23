// src/models/HistorialIluminacion.ts
import {
  Table,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  AllowNull,
  Model,
} from 'sequelize-typescript';
import Zona from './zona';
import ProgramacionIluminacion from './programacionIluminacion';

@Table({
  tableName: 'tbl_historial_iluminacion',
  timestamps: true,
  createdAt: 'fecha_creacion',      
  updatedAt: 'fecha_actualizacion', 
})
export default class HistorialIluminacion extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  id_historial_iluminacion!: number;

  @ForeignKey(() => ProgramacionIluminacion) 
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  id_iluminacion!: number;

  @ForeignKey(() => Zona)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  id_zona!: number;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  fecha_activacion!: Date;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  duracion_minutos!: number;

  @CreatedAt
  fecha_creacion!: Date;

  @UpdatedAt
  fecha_actualizacion!: Date;
}
