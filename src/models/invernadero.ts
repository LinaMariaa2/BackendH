//invernadero
import { Table,Column,Model,HasMany,DataType,PrimaryKey,AutoIncrement,CreatedAt,UpdatedAt,ForeignKey,BelongsTo,} from 'sequelize-typescript';
import { Persona } from './Persona';
import { Zona } from './zona';

@Table({ tableName: 'tbl_invernadero', timestamps: true, underscored: true })
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
  type: DataType.ENUM({
    values: ['activo', 'inactivo', 'mantenimiento'],
  }),
  field: 'estado',
  allowNull: false,
  defaultValue: 'activo',
})
declare estado: 'activo' | 'inactivo' | 'mantenimiento';


  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare zonas_totales: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare zonas_activas: number;

 @ForeignKey(() => Persona)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'responsable_id', // nombre del campo 
    onDelete: 'CASCADE',
})
declare responsable_id: number;

@BelongsTo(() => Persona, { foreignKey: 'responsable_id', as:'encargado' })
declare persona: Persona;

  @HasMany(() => Zona, { foreignKey: 'id_invernadero' })
  declare zonas: Zona[];

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;
}

export default Invernadero;
