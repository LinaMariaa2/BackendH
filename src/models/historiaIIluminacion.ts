// src/models/Iluminacion.ts 

import {Table, Column, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, ForeignKey, AllowNull,} from 'sequelize-typescript';
import { Model } from 'sequelize-typescript';
import zona from './zona' 

@Table({
  tableName: 'tbl_historial_iluminacion', timestamps: true,})
export default class iluminacion extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column({type: DataType.INTEGER, allowNull: false, })
  id_historial_iluminacion!: number;


  @ForeignKey(() => zona) 
  @AllowNull(false)
  @Column({type: DataType.INTEGER,})
  id_zona!: number;

  @ForeignKey(() => zona) 
  @AllowNull(false)
  @Column({type: DataType.INTEGER,})
  id_iluminacion!: number;

  @AllowNull(false)
  @Column({type: DataType.DATE,})
  fecha_activacion!: Date;

  @AllowNull(false)
  @Column({type: DataType.INTEGER,})
  duracion_minutos!: number; 

  @CreatedAt 
  fecha_creacion!: Date; 

  @UpdatedAt
  fecha_actualizacion!: Date; 
}

