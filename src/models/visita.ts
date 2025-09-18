import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({
  tableName: 'visita',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
})
export class Visita extends Model<Visita> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: 'id_visita',
  })
  id_visita!: number;

  @Column({
    type: DataType.STRING(255),
    field: 'nombre_visitante',
    allowNull: false,
  })
  nombre_visitante!: string;

  @Column({
    type: DataType.STRING(255),
    field: 'motivo',
    allowNull: true,
  })
  motivo!: string;

  @Column({
    type: DataType.BOOLEAN,
    field: 'leida',
    defaultValue: false,
    allowNull: false,
  })
  leida!: boolean;
}

export default Visita;
