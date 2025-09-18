// src/router/perfilRouter.ts
import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/UserController'; 

import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware';
const router = Router();

router.get('/', authenticateJWT,
    (req: Request, res: Response, next: NextFunction) => {
        UserController.getAuthenticatedUserProfile(req, res).catch(next);
    }
);


router.put('/update',authenticateJWT,
    (req: Request, res: Response, next: NextFunction) => {
        UserController.updateAuthenticatedUserProfile(req, res).catch(next);
    }
);



export default router;
