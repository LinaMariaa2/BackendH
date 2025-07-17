"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GestionCultivo = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const zona_1 = __importDefault(require("./zona"));
let GestionCultivo = class GestionCultivo extends sequelize_typescript_1.Model {
};
exports.GestionCultivo = GestionCultivo;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], GestionCultivo.prototype, "id_cultivo", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], GestionCultivo.prototype, "nombre_cultivo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], GestionCultivo.prototype, "descripcion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], GestionCultivo.prototype, "temp_min", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], GestionCultivo.prototype, "temp_max", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], GestionCultivo.prototype, "humedad_min", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], GestionCultivo.prototype, "humedad_max", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], GestionCultivo.prototype, "fecha_inicio", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], GestionCultivo.prototype, "fecha_fin", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('activo', 'finalizado')),
    __metadata("design:type", String)
], GestionCultivo.prototype, "estado", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], GestionCultivo.prototype, "imagenes", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => zona_1.default),
    (0, sequelize_typescript_1.AllowNull)(true) // si quieres que sea opcional
    ,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], GestionCultivo.prototype, "id_zona", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => zona_1.default),
    __metadata("design:type", zona_1.default)
], GestionCultivo.prototype, "zona", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_at' }),
    __metadata("design:type", Date)
], GestionCultivo.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_at' }),
    __metadata("design:type", Date)
], GestionCultivo.prototype, "updatedAt", void 0);
exports.GestionCultivo = GestionCultivo = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'tbl_gestion_cultivos', timestamps: true })
], GestionCultivo);
exports.default = GestionCultivo;
//# sourceMappingURL=gestionarCultivos.js.map