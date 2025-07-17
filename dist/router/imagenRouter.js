"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/uploadRoutes.ts
const express_1 = require("express");
const imagenValidation_1 = require("../middlewares/imagenValidation");
const imagenController_1 = require("../controllers/imagenController");
const router = (0, express_1.Router)();
router.post('/imagen-cultivo', imagenValidation_1.upload.single('imagen'), imagenController_1.uploadCultivoImage);
exports.default = router;
//# sourceMappingURL=imagenRouter.js.map