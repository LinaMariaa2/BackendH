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
exports.Zona = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const invernadero_1 = require("./invernadero");
const gestionarCultivos_1 = require("./gestionarCultivos");
let Zona = class Zona extends sequelize_typescript_1.Model {
};
exports.Zona = Zona;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Zona.prototype, "id_zona", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], Zona.prototype, "nombre", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Zona.prototype, "descripciones_add", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('activo', 'inactivo', 'mantenimiento')),
    __metadata("design:type", String)
], Zona.prototype, "estado", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => invernadero_1.Invernadero),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Zona.prototype, "id_invernadero", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => invernadero_1.Invernadero),
    __metadata("design:type", invernadero_1.Invernadero)
], Zona.prototype, "invernadero", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => gestionarCultivos_1.GestionCultivo),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Object)
], Zona.prototype, "id_cultivo", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => gestionarCultivos_1.GestionCultivo),
    __metadata("design:type", gestionarCultivos_1.GestionCultivo)
], Zona.prototype, "cultivo", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_at', type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], Zona.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_at', type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], Zona.prototype, "updatedAt", void 0);
exports.Zona = Zona = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'tbl_zona', timestamps: true, underscored: true })
], Zona);
exports.default = Zona;
//# sourceMappingURL=zona.js.map