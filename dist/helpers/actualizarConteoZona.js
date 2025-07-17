"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualizarConteoZonas = void 0;
const zona_1 = __importDefault(require("../models/zona"));
const invernadero_1 = __importDefault(require("../models/invernadero"));
const actualizarConteoZonas = async (id_invernadero) => {
    const zonas = await zona_1.default.findAll({ where: { id_invernadero } });
    const zonasActivas = zonas.filter(zona => zona.estado === 'activo');
    await invernadero_1.default.update({
        zonas_totales: zonas.length,
        zonas_activas: zonasActivas.length,
    }, { where: { id_invernadero } });
};
exports.actualizarConteoZonas = actualizarConteoZonas;
//# sourceMappingURL=actualizarConteoZona.js.map