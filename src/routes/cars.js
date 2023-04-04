import { Router } from "express";
import {
  getAllCars,
  getCar,
  createCar,
  updateCar,
  updateEntryTime,
  updateDepartureTime,
  updateTotalTimeMonth,
  updateAllCars,
} from "../controllers/car.js";

const router = Router();

router
  .get("/", getAllCars)
  .get("/:plate", getCar)
  .post("/", createCar)
  .put("/beginMonth", updateAllCars)
  .put("/:plate/totalTime", updateTotalTimeMonth)
  .put("/:plate/entryTime", updateEntryTime)
  .put("/:plate/departureTime", updateDepartureTime)
  .put("/:plate/typeCar", updateCar);

export default router;
