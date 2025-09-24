import { Router } from "express";
import { registrarLectura, registrarLecturaDHT11 } from "../controllers/LecturaSensorController";

const router = Router();

// 🔹 Ruta original
router.post("/", async (req, res, next) => {
  try {
    await registrarLectura(req, res, next);
  } catch (err) {
    next(err);
  }
});

// 🔹 Nueva ruta para DHT11 (misma estructura)
router.post("/dht11", async (req, res, next) => {
  try {
    await registrarLecturaDHT11(req, res, next);
  } catch (err) {
    next(err);
  }
});

export default router;

