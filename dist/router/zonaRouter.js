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
router.get('/zonaActual/:id/estado-real', zonaController_1.zonaController.obtenerCultivoActualPorZona);
router.get('/:id_zona', zonaValidator_1.validateZonaId, validation_1.handleInputErrors, zonaController_1.zonaController.getById);
// Crear nueva zona (solo si invernadero está activo y tiene < 5 zonas)
router.post('/', zonaValidator_1.validateZonaBody, zonaValidator_1.validateZonaNombreUnico, zonaValidator_1.validateInvernaderoExistente, validation_1.handleInputErrors, zonaController_1.zonaController.crearZona);
router.put('/:id', zonaValidator_1.validateZonaId, zonaValidator_1.validateZonaBody, zonaValidator_1.validateZonaNombreUnico, validation_1.handleInputErrors, zonaController_1.zonaController.actualizarZona);
router.patch('/:id/estado', zonaValidator_1.validateZonaId, validation_1.handleInputErrors, zonaController_1.zonaController.cambiarEstadoGenerico);
router.patch('/inactivar/:id', zonaValidator_1.validateZonaId, validation_1.handleInputErrors, zonaController_1.zonaController.inactivarZona);
router.patch('/activar/:id', zonaValidator_1.validateZonaId, validation_1.handleInputErrors, zonaController_1.zonaController.activarZona);
router.patch('/mantenimiento/:id', zonaValidator_1.validateZonaId, validation_1.handleInputErrors, zonaController_1.zonaController.mantenimientoZona);
router.delete('/:id', zonaValidator_1.validateZonaId, validation_1.handleInputErrors, zonaController_1.zonaController.eliminarZona);
exports.default = router;
//# sourceMappingURL=zonaRouter.js.map