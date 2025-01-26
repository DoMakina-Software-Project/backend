import { Router } from "express";
import CarsRoute from "./cars.route.js";

const router = Router();
router.use("/cars", CarsRoute);

export default router;
