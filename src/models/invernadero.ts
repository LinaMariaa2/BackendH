import {
  Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, ForeignKey} from 'sequelize-typescript';

@Table({tableName: 'tbl_invernadero', timestamps: true })
    export class Invernadero extends Model<Invernadero> {

  @PrimaryKey@AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  id_invernadero!: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  nombre!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  descripcion!: string;

  @Column({
    type: DataType.ENUM('activo', 'inactivo', 'mantenimiento'),
    allowNull: false,
    defaultValue: 'activo'
  })
  estado!: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  zonas_totales!: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  zonas_activas!: number;

//   @Column({ type: DataType.INTEGER, allowNull: false, field: 'responsable_id' })
//   responsable_id!: number;

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;
  
   //@ForeignKey(() => Persona)
  //@Column({ field: 'responsable_id', type: DataType.INTEGER, onDelete: 'CASCADE' })
  //responsableId: number;

  //@BelongsTo(() => Persona)
  //persona: Persona;

}

export default Invernadero;
