import { Router } from "express";
import PromotionPriceRoute from "./promotion-price.route.js";
import BrandRoute from "./brand.route.js";

const router = Router();

router.use("/promotion-prices", PromotionPriceRoute);
router.use("/brands", BrandRoute);

export default router;
