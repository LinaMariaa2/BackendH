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
exports.ZonaCultivoActual = void 0;
// ✅ MODELO ZonaCultivoActual
const sequelize_typescript_1 = require("sequelize-typescript");
const zona_1 = __importDefault(require("./zona"));
const gestionarCultivos_1 = __importDefault(require("./gestionarCultivos"));
let ZonaCultivoActual = class ZonaCultivoActual extends sequelize_typescript_1.Model {
};
exports.ZonaCultivoActual = ZonaCultivoActual;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.ForeignKey)(() => zona_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], ZonaCultivoActual.prototype, "id_zona", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => gestionarCultivos_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], ZonaCultivoActual.prototype, "id_cultivo", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => zona_1.default, { as: 'zona', foreignKey: 'id_zona' }),
    __metadata("design:type", zona_1.default)
], ZonaCultivoActual.prototype, "zona", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => gestionarCultivos_1.default, { as: 'cultivo', foreignKey: 'id_cultivo' }),
    __metadata("design:type", gestionarCultivos_1.default)
], ZonaCultivoActual.prototype, "cultivo", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_at' }),
    __metadata("design:type", Date)
], ZonaCultivoActual.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_at' }),
    __metadata("design:type", Date)
], ZonaCultivoActual.prototype, "updatedAt", void 0);
exports.ZonaCultivoActual = ZonaCultivoActual = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'tbl_zona_cultivo_actual', timestamps: true })
], ZonaCultivoActual);
exports.default = ZonaCultivoActual;
//# sourceMappingURL=ZonaCultivoActual.js.map