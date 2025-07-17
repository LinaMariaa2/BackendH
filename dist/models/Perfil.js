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
exports.Perfil = void 0;
// src/models/Perfil.ts (Tu código actual, verificado)
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_typescript_2 = require("sequelize-typescript");
const Persona_1 = __importDefault(require("./Persona"));
let Perfil = class Perfil extends sequelize_typescript_2.Model {
};
exports.Perfil = Perfil;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Perfil.prototype, "id_perfil", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Persona_1.default),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, onDelete: 'CASCADE' }),
    __metadata("design:type", Number)
], Perfil.prototype, "personaId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Persona_1.default),
    __metadata("design:type", Persona_1.default)
], Perfil.prototype, "persona", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) }),
    __metadata("design:type", String)
], Perfil.prototype, "nombre_usuario", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) }),
    __metadata("design:type", String)
], Perfil.prototype, "correo", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('activo'),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('activo', 'inactivo', 'mantenimiento')),
    __metadata("design:type", String)
], Perfil.prototype, "estado", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(''),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], Perfil.prototype, "foto_url", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN }),
    __metadata("design:type", Boolean)
], Perfil.prototype, "isVerified", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('admin', 'operario')),
    __metadata("design:type", String)
], Perfil.prototype, "rol", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_at' }),
    __metadata("design:type", Date)
], Perfil.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_at' }),
    __metadata("design:type", Date)
], Perfil.prototype, "updatedAt", void 0);
exports.Perfil = Perfil = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'tbl_perfil', timestamps: true }) // Asegúrate de que 'tbl_perfil' es el nombre correcto de tu tabla
], Perfil);
exports.default = Perfil;
//# sourceMappingURL=Perfil.js.map