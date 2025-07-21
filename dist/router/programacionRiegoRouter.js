"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PrograRiegoController_1 = require("../controllers/PrograRiegoController");
const validarProgramacionRiego_1 = require("../middlewares/validarProgramacionRiego");
const validation_1 = require("../middlewares/validation");
const router = (0, express_1.Router)();
router.get('/zonas/activas', PrograRiegoController_1.PrograRiegoController.getZonasRiegoActivasParaESP32);
router.get('/', PrograRiegoController_1.PrograRiegoController.getTodasLasProgramaciones);
router.get('/:id', PrograRiegoController_1.PrograRiegoController.getProgramacionPorId);
router.post('/', validarProgramacionRiego_1.validarProgramacionRiego, validation_1.handleInputErrors, PrograRiegoController_1.PrograRiegoController.crearProgramacion);
router.put('/:id', validarProgramacionRiego_1.validarProgramacionRiego, validation_1.handleInputErrors, PrograRiegoController_1.PrograRiegoController.actualizarProgramacion);
router.delete('/:id', PrograRiegoController_1.PrograRiegoController.eliminarProgramacion);
exports.default = router;
//# sourceMappingURL=programacionRiegoRouter.js.map