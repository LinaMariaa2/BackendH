"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gestionarCultivoController_1 = require("../controllers/gestionarCultivoController");
const gestionarCultivoValidation_1 = require("../middlewares/gestionarCultivoValidation");
const validation_1 = require("../middlewares/validation");
const router = (0, express_1.Router)();
router.get('/zona/:id_zona', gestionarCultivoController_1.gestionCultivoController.getPorZona);
router.get('/', gestionarCultivoController_1.gestionCultivoController.getAll);
router.get('/:id', gestionarCultivoValidation_1.validateCultivoId, validation_1.handleInputErrors, gestionarCultivoController_1.gestionCultivoController.getId);
router.patch('/:id/estado/:estado', gestionarCultivoValidation_1.validateCultivoId, validation_1.handleInputErrors, gestionarCultivoController_1.gestionCultivoController.cambiarEstado);
router.put('/:id', gestionarCultivoValidation_1.validateCultivoId, validation_1.handleInputErrors, gestionarCultivoController_1.gestionCultivoController.actualizarCultivo);
router.post('/', gestionarCultivoValidation_1.validateCultivoBody, validation_1.handleInputErrors, gestionarCultivoController_1.gestionCultivoController.crearCultivo);
router.delete('/:id', gestionarCultivoValidation_1.validateCultivoId, validation_1.handleInputErrors, gestionarCultivoController_1.gestionCultivoController.eliminarCultivo);
exports.default = router;
//# sourceMappingURL=gestionarCultivoRouter.js.map