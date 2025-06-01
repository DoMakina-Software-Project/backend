import { Router } from "express";
import CarsRoute from "./cars.route";
import BrandsRoute from "./brands.route";
import PromotionPriceRoute from "./promotion-price.route";

const router = Router();

router.use("/cars", CarsRoute);
router.use("/brands", BrandsRoute);
router.use("/promotion-price", PromotionPriceRoute);

export default router;
