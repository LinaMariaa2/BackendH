"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bitacoraController_1 = require("../controllers/bitacoraController");
const bitacoraValidation_1 = require("../middlewares/bitacoraValidation");
const validation_1 = require("../middlewares/validation");
const router = (0, express_1.Router)();
router.get('/', bitacoraController_1.bitacoraController.getAll);
router.get('/:id', bitacoraValidation_1.validacionIdBitacora, validation_1.handleInputErrors, bitacoraController_1.bitacoraController.getById);
router.post('/', bitacoraValidation_1.validacionBitacoraBody, validation_1.handleInputErrors, bitacoraController_1.bitacoraController.crear);
router.put('/:id', bitacoraValidation_1.validacionIdBitacora, bitacoraValidation_1.validacionBitacoraBody, validation_1.handleInputErrors, bitacoraController_1.bitacoraController.actualizar);
router.delete('/:id', bitacoraValidation_1.validacionIdBitacora, validation_1.handleInputErrors, bitacoraController_1.bitacoraController.eliminar);
router.get('/invernadero/:id_invernadero', bitacoraController_1.bitacoraController.getByInvernadero);
router.patch('/:id/archivar', bitacoraValidation_1.validacionIdBitacora, validation_1.handleInputErrors, bitacoraController_1.bitacoraController.archivar);
router.patch('/:id/desarchivar', bitacoraValidation_1.validacionIdBitacora, validation_1.handleInputErrors, bitacoraController_1.bitacoraController.desarchivar);
exports.default = router;
//# sourceMappingURL=bitacoraRouter.js.map