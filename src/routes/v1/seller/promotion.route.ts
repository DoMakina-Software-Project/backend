import { Router } from "express";
import { SellerPromotionController } from "../../../controllers/seller";
import { PromotionValidator, throwValidationErrors } from "../validators";

const router = Router();
router.get(
	"/:id",
	PromotionValidator.getPromotion,
	throwValidationErrors,
	SellerPromotionController.getPromotion
);
router.post(
	"/",
	PromotionValidator.createPromotion,
	throwValidationErrors,
	SellerPromotionController.createPromotion
);
router.put(
	"/:id",
	PromotionValidator.updatePromotion,
	throwValidationErrors,
	SellerPromotionController.updatePromotion
);
router.delete(
	"/:id",
	PromotionValidator.deletePromotion,
	throwValidationErrors,
	SellerPromotionController.deletePromotion
);

export default router;
