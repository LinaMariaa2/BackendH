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
exports.Bitacora = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const invernadero_1 = require("./invernadero");
const zona_1 = require("./zona");
const Persona_1 = require("./Persona");
let Bitacora = class Bitacora extends sequelize_typescript_1.Model {
};
exports.Bitacora = Bitacora;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Bitacora.prototype, "id_publicacion", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], Bitacora.prototype, "titulo", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Bitacora.prototype, "contenido", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('media'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('alta', 'media', 'baja')),
    __metadata("design:type", String)
], Bitacora.prototype, "importancia", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('riego', 'iluminacion', 'cultivo', 'alerta', 'mantenimiento', 'hardware', 'general')),
    __metadata("design:type", String)
], Bitacora.prototype, "tipo_evento", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.ForeignKey)(() => invernadero_1.Invernadero),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Bitacora.prototype, "id_invernadero", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => invernadero_1.Invernadero),
    __metadata("design:type", invernadero_1.Invernadero)
], Bitacora.prototype, "invernadero", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => zona_1.Zona),
    (0, sequelize_typescript_1.AllowNull)(true),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Bitacora.prototype, "id_zona", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => zona_1.Zona),
    __metadata("design:type", zona_1.Zona)
], Bitacora.prototype, "zona", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Persona_1.Persona),
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Bitacora.prototype, "autor_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Persona_1.Persona),
    __metadata("design:type", Persona_1.Persona)
], Bitacora.prototype, "autor", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false) // por defecto no está archivada
    ,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Bitacora.prototype, "archivada", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.NOW),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Bitacora.prototype, "timestamp_publicacion", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_at' }),
    __metadata("design:type", Date)
], Bitacora.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_at' }),
    __metadata("design:type", Date)
], Bitacora.prototype, "updatedAt", void 0);
exports.Bitacora = Bitacora = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'tbl_bitacora', timestamps: true })
], Bitacora);
exports.default = Bitacora;
//# sourceMappingURL=bitacora.js.map