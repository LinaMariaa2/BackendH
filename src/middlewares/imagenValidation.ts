// src/middlewares/upload.ts
import multer from 'multer';

const storage = multer.memoryStorage(); // Guarda en memoria temporal

export const upload = multer({ storage });
