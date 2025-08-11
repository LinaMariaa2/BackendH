import {
  Table, Column, DataType, PrimaryKey, AutoIncrement, ForeignKey,
  Model, CreatedAt, UpdatedAt, AllowNull, BelongsTo
} from 'sequelize-typescript';
import Zona from './zona'; 

@Table({ tableName: 'tbl_programacion_riego', timestamps: true })
export class ProgramacionRiego extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id_pg_riego: number;

  @AllowNull(false)
  @Column({ type: DataType.DATE }) 
  declare fecha_inicio: Date;

  @AllowNull(false)
  @Column({ type: DataType.DATE }) 
  declare fecha_finalizacion: Date;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare descripcion: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  declare tipo_riego: 'goteo' | 'aspersión' | 'Manual';

  @ForeignKey(() => Zona)
  @AllowNull(false)
  @Column(DataType.INTEGER)
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
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare estado: boolean;
  }

export default ProgramacionRiego;
