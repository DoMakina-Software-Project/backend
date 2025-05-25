import { Router } from "express";
import { PromotionController } from "../../../controllers/seller/index.js";
import {
	PromotionValidator,
	throwValidationErrors,
} from "../validators/index.js";

const router = Router();
router.get(
	"/:id",
	PromotionValidator.getPromotion,
	throwValidationErrors,
	PromotionController.getPromotion
);
router.post(
	"/",
	PromotionValidator.createPromotion,
	throwValidationErrors,
	PromotionController.createPromotion
);
router.put(
	"/:id",
	PromotionValidator.updatePromotion,
	throwValidationErrors,
	PromotionController.updatePromotion
);
router.delete(
	"/:id",
	PromotionValidator.deletePromotion,
	throwValidationErrors,
	PromotionController.deletePromotion
);

export default router;
