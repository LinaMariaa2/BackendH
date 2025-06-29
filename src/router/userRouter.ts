// src/router/userRouter.ts
import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';
import {
    validatePersonaId,
    validateAdminPersonaUpdate,
    handleInputErrors
} from '../middlewares/userValidation';

const router = Router();

//Rutas de Gestión de Usuarios (TODAS Requieren Autenticación y Rol de 'admin') 

//  Obtener todas las Personas
router.get(
    '/',
    authMiddleware as any, 
    authorizeRoles(['admin']) as any, 
    UserController.getAll
);

//  Obtener Personas Activas y Verificadas
router.get(
    '/activos',
    authMiddleware as any, 
    authorizeRoles(['admin']) as any, 
    UserController.getAllActivos
);

// Mostrar Persona por ID
router.get(
    '/:id_persona',
    authMiddleware as any, 
    authorizeRoles(['admin']) as any,
    ...(validatePersonaId as any),
    UserController.getById
);

// Actualizar una Persona
router.put(
    '/:id_persona',
    authMiddleware as any, 
    authorizeRoles(['admin']) as any,
    ...(validatePersonaId as any),
    ...(validateAdminPersonaUpdate as any),
    UserController.actualizarPersona
);

// Rutas para Cambios de Estado 
router.put(
    '/inactivar/:id_persona',
    authMiddleware as any, 
    authorizeRoles(['admin']) as any,
    ...(validatePersonaId as any),
    UserController.inactivarPersona
);
router.put(
    '/activar/:id_persona',
    authMiddleware as any, 
    authorizeRoles(['admin']) as any, 
    ...(validatePersonaId as any),
    UserController.activarPersona
);
router.put(
    '/bloquear/:id_persona',
    authMiddleware as any, 
    authorizeRoles(['admin']) as any, 
    ...(validatePersonaId as any),
    UserController.bloquearPersona
);

// Eliminar Persona permanentemente
router.delete(
    '/:id_persona',
    authMiddleware as any, 
    authorizeRoles(['admin']) as any, 
    ...(validatePersonaId as any),
    UserController.eliminarPersona
);

export default router;
