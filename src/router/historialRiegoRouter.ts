import { Router } from 'express';
import { getAllRiego } from '../controllers/historialRiegoController'; 


const router = Router();
router.get('/iluminacion',getAllRiego ); 

export default router;