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
exports.ProgramacionIluminacion = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const zona_1 = __importDefault(require("./zona"));
let ProgramacionIluminacion = class ProgramacionIluminacion extends sequelize_typescript_1.Model {
};
exports.ProgramacionIluminacion = ProgramacionIluminacion;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ProgramacionIluminacion.prototype, "id_iluminacion", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }) // timestamp con fecha y hora completa
    ,
    __metadata("design:type", Date)
], ProgramacionIluminacion.prototype, "fecha_inicio", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }) // timestamp con fecha y hora completa
    ,
    __metadata("design:type", Date)
], ProgramacionIluminacion.prototype, "fecha_finalizacion", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT }),
    __metadata("design:type", String)
], ProgramacionIluminacion.prototype, "descripcion", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => zona_1.default),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], ProgramacionIluminacion.prototype, "id_zona", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => zona_1.default),
    __metadata("design:type", zona_1.default)
], ProgramacionIluminacion.prototype, "zona", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_at' }),
    __metadata("design:type", Date)
], ProgramacionIluminacion.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_at' }),
    __metadata("design:type", Date)
], ProgramacionIluminacion.prototype, "updatedAt", void 0);
exports.ProgramacionIluminacion = ProgramacionIluminacion = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'tbl_programacion_iluminacion', timestamps: true })
], ProgramacionIluminacion);
exports.default = ProgramacionIluminacion;
//# sourceMappingURL=programacionIluminacion.js.map