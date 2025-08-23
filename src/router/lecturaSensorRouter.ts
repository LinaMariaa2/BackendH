import { Router } from "express";
import { registrarLectura } from "../controllers/LecturaSensorController";

const router = Router();

// Forma correcta
router.post("/", async (req, res, next) => {
  try {
    await registrarLectura(req, res, next);
  } catch (err) {
    next(err);
  }
});

export default router;
