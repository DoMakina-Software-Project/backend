import { Router } from "express";
import PromotionPriceRoute from "./promotion-price.route";
import BrandRoute from "./brand.route";
import DashboardRoute from "./dashboard.route";

const router = Router();

router.use("/promotion-prices", PromotionPriceRoute);
router.use("/brands", BrandRoute);
router.use("/dashboard", DashboardRoute);

export default router;
