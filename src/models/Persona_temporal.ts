import { Table, Column, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, Default, AllowNull, Comment } from 'sequelize-typescript';
import { Model } from 'sequelize-typescript';

@Table({ tableName: "tbl_persona_temporal", timestamps: true, underscored: true }) 
export class persona_temporal extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare id_persona_temporal: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(50) })
  declare nombre_usuario_temporal: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(100), unique: true })
  declare correo: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(255) })
  declare contrasena: string;

  @Default('aprendiz')
  @AllowNull(false)
  @Column({
    type: DataType.ENUM('administrador', 'instructor', 'aprendiz')
  })
  declare rol: 'administrador' | 'instructor' | 'aprendiz';

  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare intentos: number;

  @AllowNull(false) 
  @Column({
    type: DataType.STRING(6), 
    comment: 'Código enviado al correo' 
  })
  declare codigo_verificacion: string; 


  @AllowNull(false) 
  @Column({
    type: DataType.DATE,
  })
  declare codigo_expira: Date; 


  @CreatedAt 
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
export default persona_temporal;