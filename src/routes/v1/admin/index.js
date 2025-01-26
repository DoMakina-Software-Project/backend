import { Router } from "express";
import PromotionPriceRoute from "./promotion-price.route.js";
const router = Router();
router.use("/promotion-price", PromotionPriceRoute);
export default router;
