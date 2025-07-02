import {
  Table, Column, Model, DataType, PrimaryKey, AutoIncrement,CreatedAt, UpdatedAt, ForeignKey, BelongsTo, AllowNull, HasMany, HasOne} from 'sequelize-typescript';
import { Invernadero } from './invernadero';
import { GestionCultivo } from './gestionarCultivos';
import { ZonaCultivoActual } from './ZonaCultivoActual';

@Table({ tableName: 'tbl_zona', timestamps: true, underscored: true })
export class Zona extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id_zona: number;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare nombre: string;

  @Column(DataType.TEXT)
  declare descripciones_add: string;

  @AllowNull(false)
  @Column(DataType.ENUM('activo', 'inactivo', 'mantenimiento'))
  declare estado: string;

  @ForeignKey(() => Invernadero)
  @Column
  declare id_invernadero: number;

  @BelongsTo(() => Invernadero)
  declare invernadero: Invernadero;

  // Relaciones limpias
  @HasMany(() => GestionCultivo)
  declare cultivos: GestionCultivo[];

  @HasOne(() => ZonaCultivoActual)
  declare cultivoActual: ZonaCultivoActual;
  
  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;

}
export default Zona;