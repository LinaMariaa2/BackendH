import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
} from 'sequelize-typescript';
import Zona from './zona';
import Persona from './Persona'; 
import { truncate } from 'fs/promises';

@Table({ tableName: 'tbl_gestion_cultivos', timestamps: true })
export class GestionCultivo extends Model<GestionCultivo> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id_cultivo: number;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare nombre_cultivo: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare descripcion: string | null;

  @AllowNull(true)
  @Column(DataType.FLOAT)
  declare temp_min: number | null;

  @AllowNull(true)
  @Column(DataType.FLOAT)
  declare temp_max: number | null;

  @AllowNull(true)
  @Column(DataType.FLOAT)
  declare humedad_min: number | null;

  @AllowNull(true)
  @Column(DataType.FLOAT)
  declare humedad_max: number | null;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare fecha_inicio: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare fecha_fin?: Date | null;

  @AllowNull(false)
  @Column(DataType.ENUM('activo', 'finalizado'))
  declare estado: 'activo' | 'finalizado';

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare imagenes: string | null;

  // Producción y disponibilidad
  @Column(DataType.ENUM('kilogramos', 'unidades'))
  declare unidad_medida: 'kilogramos' | 'unidades';

  @Column(DataType.INTEGER)
  declare cantidad_cosechada: number;

  @Column(DataType.INTEGER)
  declare cantidad_disponible: number;

  @Column(DataType.INTEGER)
  declare cantidad_reservada:number;

  // NO tocar configuración de embedding
  @Column({ type: DataType.TEXT, field: 'embedding' }) 
  declare embedding: number[];

  // Relación con Zona
  @ForeignKey(() => Zona)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare id_zona: number | null;

  @BelongsTo(() => Zona)
  declare zona?: Zona;

  // Relación con Persona (responsable obligatorio)
  @ForeignKey(() => Persona)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    field: 'responsable_id',
    onDelete: 'CASCADE',
  })
  declare responsable_id: number;

  @BelongsTo(() => Persona, { foreignKey: 'responsable_id', as: 'encargado' })
  declare persona: Persona;

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;
}

export default GestionCultivo;
