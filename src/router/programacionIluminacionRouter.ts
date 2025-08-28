import { Router } from "express";
import { ProgramacionIluminacionController } from "../controllers/prograIluminController";

const router = Router();

router.get("/", ProgramacionIluminacionController.getAll);
router.get("/:zonaId", ProgramacionIluminacionController.getByZona);

export default router;
