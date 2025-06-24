import { Router } from 'express';
import { PersonaController } from '../controllers/personaControllers'; 

const router = Router();

// Rutas GET
router.get('/', PersonaController.getAll); // Obtener todas las personas
router.get('/activos', PersonaController.getAllActivos); // Obtener solo personas activas
router.get('/:id', PersonaController.getById); // Obtener una persona por su ID

// Rutas POST
router.post('/', PersonaController.crearPersona); // Crear una nueva persona

// Rutas PUT (actualización completa o de estado)
router.put('/:id', PersonaController.actualizarPersona); // Actualizar los datos de una persona
router.put('/inactivar/:id', PersonaController.inactivarPersona); // Inactivar una persona
router.put('/activar/:id', PersonaController.activarPersona); // Activar una persona
router.put('/bloquear/:id', PersonaController.bloquearPersona); // Bloquear una persona

// Rutas DELETE
router.delete('/:id', PersonaController.eliminarPersona); // Eliminar una persona permanentemente

export default router;