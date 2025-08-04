import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import upload from '../config/multerConfig'; // Importa la instancia de Multer

const router = Router();

// Nuevo método para obtener el perfil del usuario autenticado (usado por /perfil)
router.get('/perfil', authenticateJWT, (req: Request, res: Response, next: NextFunction) => {
    UserController.getAuthenticatedUserProfile(req, res).catch(next);
});

// Nuevo método para actualizar el perfil del usuario autenticado (usado por /perfil/update)
router.put('/perfil/update', authenticateJWT, (req: Request, res: Response, next: NextFunction) => {
    UserController.updateAuthenticatedUserProfile(req, res).catch(next);
});

// Ruta para subir la foto de perfil
router.post(
    '/:id_persona/upload-photo', 
    authenticateJWT,
    upload.single('profile_picture'), 
    (req: Request, res: Response, next: NextFunction) => {
 
        UserController.uploadProfilePhoto(req, res).catch(next);
    }
);

// Obtener todas las Personas (Solo Admin)
router.get('/', authenticateJWT, (req: Request, res: Response, next: NextFunction) => {
   
    if (req.user?.rol !== 'admin') {
         res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden ver todas las personas.' });
    }
    UserController.getAll(req, res).catch(next);
});

// Obtener Personas Activas y Verificadas (Solo Admin)
router.get('/activos', authenticateJWT, (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.rol !== 'admin') {
        res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden ver perfiles activos.' });
    }
    UserController.getAllActivos(req, res).catch(next);
});

router.get('/:id_persona', authenticateJWT, (req: Request, res: Response, next: NextFunction) => {
 
    UserController.getById(req, res).catch(next);
});

// Actualizar Persona (Solo Admin)
router.put('/:id_persona', authenticateJWT, (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.rol !== 'admin') {
     res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden actualizar personas.' });
    }
    UserController.update(req, res).catch(next);
});

// Eliminar Persona (Solo Admin)
router.delete('/:id_persona', authenticateJWT, (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.rol !== 'admin') {
       res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden eliminar personas.' });
    }
    UserController.delete(req, res).catch(next);
});

export default router;