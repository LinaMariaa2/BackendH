"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const personaControllers_1 = require("../controllers/personaControllers");
const personaValidator_1 = require("../middlewares/personaValidator");
const validation_1 = require("../middlewares/validation");
const router = (0, express_1.Router)();
router.get('/', personaControllers_1.PersonaController.getAll);
router.get('/activos', personaControllers_1.PersonaController.getAllActivos);
router.get('/operarios', personaControllers_1.PersonaController.getOperarios);
router.get('/:id', personaValidator_1.validatePersonaId, validation_1.handleInputErrors, personaControllers_1.PersonaController.getById);
exports.default = router;
//# sourceMappingURL=personaRouter.js.map