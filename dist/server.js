"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan")); // For HTTP request logs
const cors_1 = __importDefault(require("cors"));
// Import existing routers for Invernadero and Zona
const invernaderoRouter_1 = __importDefault(require("./router/invernaderoRouter"));
const userRouter_1 = __importDefault(require("./router/userRouter"));
const gestionarCultivoRouter_1 = __importDefault(require("./router/gestionarCultivoRouter"));
const bitacoraRouter_1 = __importDefault(require("./router/bitacoraRouter"));
const imagenRouter_1 = __importDefault(require("./router/imagenRouter"));
const zonaRouter_1 = __importDefault(require("./router/zonaRouter"));
// IMPORTANT!: Import the NEW routers for Authentication and Person Management
const authRouter_1 = __importDefault(require("./router/authRouter"));
const userRouter_2 = __importDefault(require("./router/userRouter"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: 'http://localhost:3000', credentials: true })); // Puerto del frontend generalmente en next 3000
// endpoints
app.use('/api/invernadero', invernaderoRouter_1.default);
app.use('/api/zona', zonaRouter_1.default);
app.use('/api/persona', userRouter_1.default);
app.use('/api/cultivos', gestionarCultivoRouter_1.default);
app.use('/api/bitacora', bitacoraRouter_1.default);
app.use('/api/imagen', imagenRouter_1.default);
app.use('/api/persona/operarios', userRouter_1.default);
// Essential Middlewares
app.use(express_1.default.json()); // Enable body-parser for JSON
app.use((0, cors_1.default)({ origin: 'http://localhost:3000', credentials: true })); // Configure CORS for your frontend
// Logging Middleware (optional, but useful for debugging in development)
app.use((0, morgan_1.default)('dev'));
// Define Routes (Endpoints)
app.use('/api/auth', authRouter_1.default); // For registration, login, email verification, admin creation
app.use('/api/users', userRouter_2.default); // For user management (admins only)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong on the server.',
        details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    });
});
// Export the Express 'app' instance so it can be imported and used in index.ts
exports.default = app;
//# sourceMappingURL=server.js.map