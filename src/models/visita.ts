import { 
  Table, Column, Model, PrimaryKey, AutoIncrement, 
  DataType, AllowNull, CreatedAt, UpdatedAt, Default 
} from 'sequelize-typescript';

@Table({ tableName: 'tbl_visitas', timestamps: true })
export class Visita extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id_visita: number;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare nombre: string;

  @AllowNull(false)
  @Column(DataType.STRING(120))
  declare correo: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare identificacion: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  declare telefono: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare ciudad: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare fecha_visita: Date;

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare motivo: string;

  @Default('pendiente')
  @Column(DataType.ENUM('pendiente', 'aceptada', 'rechazada'))
  declare estado: 'pendiente' | 'aceptada' | 'rechazada';

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;
}

export default Visita;
