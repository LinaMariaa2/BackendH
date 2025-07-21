"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prograIluminController_1 = require("../controllers/prograIluminController");
const validarProgramacionIlum_1 = require("../middlewares/validarProgramacionIlum");
const validation_1 = require("../middlewares/validation");
const router = (0, express_1.Router)();
// 🟢 Rutas específicas primero
router.get('/zonas/activas', prograIluminController_1.PrograIluminController.getZonasActivasParaESP32);
// 🟡 Rutas generales después
router.get('/', prograIluminController_1.PrograIluminController.getTodasLasProgramaciones);
router.get('/:id', prograIluminController_1.PrograIluminController.getProgramacionPorId);
router.post('/', validarProgramacionIlum_1.validarProgramacion, validation_1.handleInputErrors, prograIluminController_1.PrograIluminController.crearProgramacion);
router.put('/:id', validarProgramacionIlum_1.validarProgramacion, validation_1.handleInputErrors, prograIluminController_1.PrograIluminController.actualizarProgramacion);
router.delete('/:id', prograIluminController_1.PrograIluminController.eliminarProgramacion);
exports.default = router;
//# sourceMappingURL=programacionIluminacionRouter.js.map