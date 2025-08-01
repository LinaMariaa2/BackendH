"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
// src/middlewares/upload.ts
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage(); // Guarda en memoria temporal
exports.upload = (0, multer_1.default)({ storage });
//# sourceMappingURL=imagenValidation.js.map