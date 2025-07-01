// src/routes/uploadRoutes.ts
import { Router } from 'express';
import { upload } from '../middlewares/imagenValidation';
import { uploadCultivoImage } from '../controllers/imagenController';

const router = Router();

router.post('/imagen-cultivo', upload.single('imagen'), uploadCultivoImage);

export default router;
