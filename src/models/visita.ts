import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({
  tableName: 'visita',
  timestamps: true, // Sequelize maneja createdAt y updatedAt
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

  @Column({
    type: DataType.STRING(255),
    field: 'correo',
    allowNull: true,
  })
  correo!: string;

  @Column({
    type: DataType.STRING(255),
    field: 'identificacion',
    allowNull: true,
  })
  identificacion!: string;

  @Column({
    type: DataType.STRING(255),
    field: 'telefono',
    allowNull: true,
  })
  telefono!: string;

  @Column({
    type: DataType.STRING(255),
    field: 'ciudad',
    allowNull: true,
  })
  ciudad!: string;

  @Column({
    type: DataType.DATE,
    field: 'fecha_visita',
    allowNull: true,
  })
  fecha_visita!: Date;

  // ✅ Dejamos declarados para autocompletado, sin sobrescribir columnas
  declare createdAt: Date;
  declare updatedAt: Date;
}

export default Visita;
