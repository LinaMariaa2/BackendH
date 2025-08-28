<<<<<<< HEAD
// src/models/HistorialRiego.ts
import { Table, Column, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, ForeignKey, AllowNull, Model } from 'sequelize-typescript';
import ProgramacionRiego from './programacionRiego'; 
import Zona from './zona';

@Table({
  tableName: 'tbl_historial_riego',
  timestamps: true, // usaremos CreatedAt y UpdatedAt
})
export default class HistorialRiego extends Model {
  
=======
// src/models/historialRiego.ts (o riego.ts)
import { Table, Column, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, ForeignKey, AllowNull, BelongsTo } from 'sequelize-typescript';
import { Model } from 'sequelize-typescript';
import Zona from './zona';
import ProgramacionRiego from './programacionRiego'; // Asegúrate de tener este modelo si existe la relación

@Table ({
  tableName: 'tbl_historial_riego',
  timestamps: true,
})
export default class HistorialRiego extends Model {
>>>>>>> estadsticas-admin
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  id_historial_riego!: number;

  @ForeignKey(() => ProgramacionRiego)
  @AllowNull(false)
<<<<<<< HEAD
  @Column({ type: DataType.INTEGER })
  id_pg_riego!: number;

  @ForeignKey(() => Zona)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  id_zona!: number;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  duracion_minutos!: number;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  fecha_activacion!: Date; 

=======
  @Column({ type: DataType.INTEGER, field: 'id_pg_riego' })
  id_pg_riego!: number;
  
  @BelongsTo(() => ProgramacionRiego, 'id_pg_riego')
  programacionRiego!: ProgramacionRiego; // Propiedad para el objeto asociado

  @ForeignKey(() => Zona)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER, field: 'id_zona' })
  id_zona!: number;

  // Define la relación: HistorialRiego pertenece a una Zona
  @BelongsTo(() => Zona, 'id_zona')
  zona!: Zona;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  duracion_minutos!: number;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  fecha_activacion!: Date;

>>>>>>> estadsticas-admin
  @CreatedAt
  fecha_creacion!: Date;

  @UpdatedAt
  fecha_actualizacion!: Date;
<<<<<<< HEAD
}
=======
}
>>>>>>> estadsticas-admin
