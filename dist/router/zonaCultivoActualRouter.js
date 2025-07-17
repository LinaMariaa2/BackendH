"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zonaCultivoActualController_1 = require("../controllers/zonaCultivoActualController");
const zonaValidator_1 = require("../middlewares/zonaValidator");
const validation_1 = require("../middlewares/validation");
const router = (0, express_1.Router)();
// Ruta para obtener estado en tiempo real de una zona
router.get('/:id_zona/estado-real', zonaValidator_1.validateZonaId, validation_1.handleInputErrors, zonaCultivoActualController_1.zonaCultivoActualController.EstadoTiempoReal);
exports.default = router;
//# sourceMappingURL=zonaCultivoActualRouter.js.map