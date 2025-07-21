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
exports.ProgramacionRiego = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const zona_1 = __importDefault(require("./zona"));
let ProgramacionRiego = class ProgramacionRiego extends sequelize_typescript_1.Model {
};
exports.ProgramacionRiego = ProgramacionRiego;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ProgramacionRiego.prototype, "id_pg_riego", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }) // Timestamp completo
    ,
    __metadata("design:type", Date)
], ProgramacionRiego.prototype, "fecha_inicio", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }) // Timestamp completo
    ,
    __metadata("design:type", Date)
], ProgramacionRiego.prototype, "fecha_finalizacion", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], ProgramacionRiego.prototype, "descripcion", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], ProgramacionRiego.prototype, "tipo_riego", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => zona_1.default),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], ProgramacionRiego.prototype, "id_zona", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => zona_1.default),
    __metadata("design:type", zona_1.default)
], ProgramacionRiego.prototype, "zona", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_at' }),
    __metadata("design:type", Date)
], ProgramacionRiego.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_at' }),
    __metadata("design:type", Date)
], ProgramacionRiego.prototype, "updatedAt", void 0);
exports.ProgramacionRiego = ProgramacionRiego = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'tbl_programacion_riego', timestamps: true })
], ProgramacionRiego);
exports.default = ProgramacionRiego;
//# sourceMappingURL=programacionRiego.js.map