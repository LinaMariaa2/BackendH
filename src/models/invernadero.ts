import {Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, ForeignKey, BelongsTo} from 'sequelize-typescript';
//import { Persona } from '../models/persona';
  
  @Table({tableName: 'tbl_invernadero', timestamps: true })
  export class Invernadero extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id_invernadero: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare nombre: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare descripcion: string;

  @Column({
    type: DataType.ENUM('activo', 'inactivo', 'mantenimiento'),
    allowNull: false,
    defaultValue: 'activo'
  })
  declare estado: 'activo' | 'inactivo' | 'mantenimiento';

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare zonas_totales: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare zonas_activas: number;

//@Column({ type: DataType.INTEGER, allowNull: false, field: 'responsable_id' })
//responsable_id!: number;

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;
  
//@ForeignKey(() => Persona)
//@AllowNull(false)
//@Column({ field: 'responsable_id', type: DataType.INTEGER, onDelete: 'CASCADE' })
//responsable_id!: number;

//@BelongsTo(() => Persona)
//persona!: Persona;

}

export default Invernadero;
