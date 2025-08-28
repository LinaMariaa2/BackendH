// src/models/zona.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  AllowNull,
  HasMany, 
} from 'sequelize-typescript';
import { Invernadero } from './invernadero';
import { GestionCultivo } from './gestionarCultivos';
import HistorialRiego from './historialRiego'; 

@Table({ tableName: 'tbl_zona', timestamps: true, underscored: true })
export class Zona extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id_zona: number;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare nombre: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare descripciones_add: string;

  @AllowNull(false)
  @Column(DataType.ENUM('activo', 'inactivo', 'mantenimiento'))
  declare estado: 'activo' | 'inactivo' | 'mantenimiento';

  @AllowNull(false)
  @Column({
    type: DataType.ENUM('activo', 'inactivo'),
    defaultValue: 'inactivo',
  })
  declare estado_iluminacion: 'activo' | 'inactivo';

  // Relación con invernadero
  @ForeignKey(() => Invernadero)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare id_invernadero: number;

  @BelongsTo(() => Invernadero)
  declare invernadero: Invernadero;

  @ForeignKey(() => GestionCultivo)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare id_cultivo: number | null;

  @BelongsTo(() => GestionCultivo)
  declare cultivo: GestionCultivo;

  // 👉 Define la relación: Una zona tiene muchos registros de historial de riego
  @HasMany(() => HistorialRiego, 'id_zona')
  declare historialesRiego: HistorialRiego[];

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at', type: DataType.DATE })
  declare updatedAt: Date;
}

export default Zona;