import { Table, Column, DataType, PrimaryKey, ForeignKey, Model, AutoIncrement, CreatedAt, UpdatedAt,BelongsTo, AllowNull } from 'sequelize-typescript';
import { Invernadero } from './invernadero';

  @Table({ tableName: 'tbl_zona', timestamps: true })
  export class Zona extends Model {
  
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id_zona: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(100) })
  declare nombre: string;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  declare descripciones_add: string;
  
  @AllowNull(false)
  @Column({
    type: DataType.ENUM('activo', 'inactivo', 'mantenimiento'),
    defaultValue: 'activo'
  })
  declare estado: 'activo' | 'inactivo' | 'mantenimiento';

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;

  @ForeignKey(() => Invernadero)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER, field: 'id_invernadero' })
  declare id_invernadero: number;

  @BelongsTo(() => Invernadero)
  declare invernadero: Invernadero;
}
export default Zona;