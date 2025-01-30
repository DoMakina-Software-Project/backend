import { Router } from "express";
import { PromotionPriceController } from "../../../controllers/public/index.js";

const router = Router();

router.get("/", PromotionPriceController.getPromotionPrice);

export default router;
