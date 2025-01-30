import { Router } from "express";
import CarsRoute from "./cars.route.js";
import BrandsRoute from "./brands.route.js";

const router = Router();
router.use("/cars", CarsRoute);
router.use("/brands", BrandsRoute);

export default router;
