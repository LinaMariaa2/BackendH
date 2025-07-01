// ✅ MODELO ZonaCultivoActual
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import Zona from './zona';
import GestionCultivo from './gestionarCultivos';

@Table({ tableName: 'tbl_zona_cultivo_actual', timestamps: true })
export class ZonaCultivoActual extends Model {
  @PrimaryKey
  @ForeignKey(() => Zona)
  @Column(DataType.INTEGER)
  declare id_zona: number;

  @ForeignKey(() => GestionCultivo)
  @Column(DataType.INTEGER)
  declare id_cultivo: number;

  @BelongsTo(() => Zona, { as: 'zona', foreignKey: 'id_zona' })
  declare zona: Zona;

  @BelongsTo(() => GestionCultivo, { as: 'cultivo', foreignKey: 'id_cultivo' })
  declare cultivo: GestionCultivo;

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;
}


export default ZonaCultivoActual;
