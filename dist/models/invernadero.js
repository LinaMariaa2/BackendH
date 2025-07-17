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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invernadero = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Persona_1 = require("./Persona");
const zona_1 = require("./zona");
let Invernadero = class Invernadero extends sequelize_typescript_1.Model {
};
exports.Invernadero = Invernadero;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Invernadero.prototype, "id_invernadero", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false }),
    __metadata("design:type", String)
], Invernadero.prototype, "nombre", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false }),
    __metadata("design:type", String)
], Invernadero.prototype, "descripcion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM({
            values: ['activo', 'inactivo', 'mantenimiento'],
        }),
        field: 'estado',
        allowNull: false,
        defaultValue: 'activo',
    }),
    __metadata("design:type", String)
], Invernadero.prototype, "estado", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0 }),
    __metadata("design:type", Number)
], Invernadero.prototype, "zonas_totales", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0 }),
    __metadata("design:type", Number)
], Invernadero.prototype, "zonas_activas", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Persona_1.Persona),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        field: 'responsable_id', // nombre del campo 
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Number)
], Invernadero.prototype, "responsable_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Persona_1.Persona, { foreignKey: 'responsable_id', as: 'encargado' }),
    __metadata("design:type", Persona_1.Persona)
], Invernadero.prototype, "persona", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => zona_1.Zona, { foreignKey: 'id_invernadero' }),
    __metadata("design:type", Array)
], Invernadero.prototype, "zonas", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_at' }),
    __metadata("design:type", Date)
], Invernadero.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_at' }),
    __metadata("design:type", Date)
], Invernadero.prototype, "updatedAt", void 0);
exports.Invernadero = Invernadero = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'tbl_invernadero', timestamps: true, underscored: true })
], Invernadero);
exports.default = Invernadero;
//# sourceMappingURL=invernadero.js.map