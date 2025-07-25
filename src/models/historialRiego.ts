//src/models/riego
import {Table, Column, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, ForeignKey, AllowNull,} from 'sequelize-typescript';
import { Model } from 'sequelize-typescript';
import zona from './zona';

@Table ({
tableName: 'tbl_historial_riego', timestamps: true,})
export default class riego extends Model {
@PrimaryKey
@AutoIncrement
@Column({type: DataType.INTEGER, allowNull: false})
id_historial_riego!: number;

@ForeignKey(() => zona)
@AllowNull(false)
@Column({type: DataType.INTEGER,})
id_pg_riego!: number;

@ForeignKey(() => zona)
@AllowNull(false)
@Column({type: DataType.INTEGER,})
id_zona!: number;

@AllowNull(false)
@Column({type: DataType.INTEGER,})
duracion_minutos!: number;

@AllowNull(false)
@Column({type: DataType.DATE,})
fecha_activacion!: Date; 

@CreatedAt
fecha_creacion!: Date;

@UpdatedAt
fecha_actualizacion!: Date;


}