import { Router } from "express";
import CarsRoute from "./cars.route.js";
import PromotionRoute from "./promotion.route.js";
import ProfileRoute from "./profile.route.js";

const router = Router();

router.use("/cars", CarsRoute);
router.use("/promotions", PromotionRoute);
router.use("/profile", ProfileRoute);

export default router;
