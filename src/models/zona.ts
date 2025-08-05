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
} from 'sequelize-typescript';
import { Invernadero } from './invernadero';
import { GestionCultivo } from './gestionarCultivos'; // Asegúrate de que este import sea correcto

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

  // 👉 Columna para el estado general de la zona (activo, inactivo, mantenimiento)
  @AllowNull(false)
  @Column(DataType.ENUM('activo', 'inactivo', 'mantenimiento'))
  declare estado: 'activo' | 'inactivo' | 'mantenimiento';

  // 👉 Nueva columna para el estado de la iluminación (activo, inactivo)
  @AllowNull(false)
  @Column({
    type: DataType.ENUM('activo', 'inactivo'),
    defaultValue: 'inactivo', // Valor por defecto
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

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at', type: DataType.DATE })
  declare updatedAt: Date;
}

export default Zona;