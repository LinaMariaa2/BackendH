import { Router } from "express";
import { ProgramacionIluminacionController } from "../controllers/prograIluminController";

const router = Router();

// Rutas para la programación de iluminación
router.get("/", ProgramacionIluminacionController.getAll);
router.get("/:zonaId", ProgramacionIluminacionController.getByZona);
router.get("/zona/:zonaId/futuras", ProgramacionIluminacionController.getByZonaFuturas);
router.post("/", ProgramacionIluminacionController.crearProgramacion);
router.put("/:id", ProgramacionIluminacionController.actualizarProgramacion);
router.patch("/:id/estado", ProgramacionIluminacionController.cambiarEstado);
router.delete("/:id", ProgramacionIluminacionController.crearProgramacion);

export default router;
