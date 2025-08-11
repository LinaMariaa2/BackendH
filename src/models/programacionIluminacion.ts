import {
  Table, Column, DataType, PrimaryKey, AutoIncrement, ForeignKey, Model, CreatedAt, UpdatedAt, AllowNull, BelongsTo,
} from 'sequelize-typescript';
import Zona from './zona'; 

@Table({ tableName: 'tbl_programacion_iluminacion', timestamps: true })
export class ProgramacionIluminacion extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id_iluminacion: number;

  @AllowNull(true)
  @Column({ type: DataType.DATE }) 
  declare fecha_inicio: Date;

  @AllowNull(true)
  @Column({ type: DataType.DATE }) 
  declare fecha_finalizacion: Date;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  declare descripcion: string;

  @ForeignKey(() => Zona)
  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  declare id_zona: number;

  @BelongsTo(() => Zona)
  declare zona: Zona;

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;


  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, defaultValue: true }) // true = activa, false = inactiva
  declare estado: boolean;

}

export default ProgramacionIluminacion;
