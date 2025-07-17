import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, AllowNull, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, Default } from 'sequelize-typescript';
import { Invernadero } from './invernadero';
import { Zona } from './zona';
import { Persona } from './Persona';

@Table({tableName: 'tbl_bitacora', timestamps: true})
export class Bitacora extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id_publicacion: number;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare titulo: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
   declare contenido: string;

  @Default('media')
  @Column(DataType.ENUM('alta', 'media', 'baja'))
  declare importancia: 'alta' | 'media' | 'baja';

  @AllowNull(true)
  @Column(DataType.ENUM('riego', 'iluminacion', 'cultivo', 'alerta',  'mantenimiento',  'hardware', 'general'))
  declare tipo_evento: 'riego' | 'iluminacion' | 'cultivo' |'alerta' |  'mantenimiento' |  'hardware' |'general';

  @AllowNull(false)
  @ForeignKey(() => Invernadero)
  @Column
  declare id_invernadero: number;

  @BelongsTo(() => Invernadero)
  declare invernadero: Invernadero;

  @ForeignKey(() => Zona)
  @AllowNull(true)
  @Column
  declare id_zona: number;

  @BelongsTo(() => Zona)
  declare zona: Zona;

  @ForeignKey(() => Persona)
  @AllowNull(false)
  @Column
  declare autor_id: number;

  @BelongsTo(() => Persona)
  declare autor: Persona;

  @Default(false) // por defecto no está archivada
  @Column(DataType.BOOLEAN)
  declare archivada: boolean;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  declare timestamp_publicacion: Date;

  @CreatedAt
    @Column({ field: 'created_at' })
    declare createdAt: Date;
  
    @UpdatedAt
    @Column({ field: 'updated_at' })
    declare updatedAt: Date;
}
export default Bitacora;