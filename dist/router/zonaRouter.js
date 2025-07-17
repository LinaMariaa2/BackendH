"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zonaController_1 = require("../controllers/zonaController");
const zonaValidator_1 = require("../middlewares/zonaValidator");
const validation_1 = require("../middlewares/validation");
const router = (0, express_1.Router)();
router.get('/', zonaController_1.zonaController.getAll);
router.get('/todos', zonaController_1.zonaController.getAllActivos);
router.get('/invernadero/:id', zonaController_1.zonaController.getZonasPorInvernadero);
router.post('/', zonaValidator_1.validateZonaBody, zonaValidator_1.validateZonaNombreUnico, zonaValidator_1.validateInvernaderoExistente, validation_1.handleInputErrors, zonaController_1.zonaController.crearZona);
router.put('/:id_zona', zonaValidator_1.validateZonaId, zonaValidator_1.validateZonaBody, zonaValidator_1.validateZonaNombreUnico, validation_1.handleInputErrors, zonaController_1.zonaController.actualizarZona);
router.patch('/cambiar-estado/:id_zona', zonaController_1.zonaController.cambiarEstadoGenerico);
router.patch('/inactivar/:id_zona', zonaValidator_1.validateZonaId, validation_1.handleInputErrors, zonaController_1.zonaController.inactivarZona);
router.patch('/activar/:id_zona', zonaValidator_1.validateZonaId, validation_1.handleInputErrors, zonaController_1.zonaController.activarZona);
router.patch('/mantenimiento/:id_zona', zonaValidator_1.validateZonaId, validation_1.handleInputErrors, zonaController_1.zonaController.mantenimientoZona);
router.delete('/:id_zona', zonaValidator_1.validateZonaId, validation_1.handleInputErrors, zonaController_1.zonaController.eliminarZona);
exports.default = router;
//# sourceMappingURL=zonaRouter.js.map