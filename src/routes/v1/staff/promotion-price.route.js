import { Router } from "express";
import { PromotionPriceController } from "../../../controllers/staff/index.js";
import {
	PromotionPriceValidator,
	throwValidationErrors,
} from "../validators/index.js";

const router = Router();

router.get("/", PromotionPriceController.getPromotionPrice);

router.post(
	"/",
	PromotionPriceValidator.createPromotionPrice,
	throwValidationErrors,
	PromotionPriceController.createPromotionPrice
);

router.put(
	"/",
	PromotionPriceValidator.updatePromotionPrice,
	throwValidationErrors,
	PromotionPriceController.updatePromotionPrice
);

export default router;
