import { Router } from "express";
import { PromotionPriceController } from "../../../controllers/public";

const router = Router();

router.get("/", PromotionPriceController.getPromotionPrice);

export default router;
