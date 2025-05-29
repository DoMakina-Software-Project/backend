import { Router } from "express";
import CarsRoute from "./cars.route.js";
import BrandsRoute from "./brands.route.js";
import PromotionPriceRoute from "./promotion-price.route.js";

const router = Router();

router.use("/cars", CarsRoute);
router.use("/brands", BrandsRoute);
router.use("/promotion-price", PromotionPriceRoute);

export default router;
