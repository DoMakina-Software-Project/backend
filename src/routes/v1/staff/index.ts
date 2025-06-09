import { Router } from "express";
import PromotionPriceRoute from "./promotion-price.route";
import BrandRoute from "./brand.route";
import DashboardRoute from "./dashboard.route";
import CarRoute from "./car.route";
import UserRoute from "./user.route";

const router = Router();

router.use("/promotion-prices", PromotionPriceRoute);
router.use("/brands", BrandRoute);
router.use("/dashboard", DashboardRoute);
router.use("/cars", CarRoute);
router.use("/users", UserRoute);

export default router;
