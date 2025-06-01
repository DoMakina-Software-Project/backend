import { Router } from "express";
import { StaffPromotionPriceController } from "../../../controllers/staff";
import { PromotionPriceValidator, throwValidationErrors } from "../validators";
const router = Router();

router.get("/", StaffPromotionPriceController.getPromotionPrice);

router.post(
	"/",
	PromotionPriceValidator.createPromotionPrice,
	throwValidationErrors,
	StaffPromotionPriceController.createPromotionPrice
);

router.put(
	"/",
	PromotionPriceValidator.updatePromotionPrice,
	throwValidationErrors,
	StaffPromotionPriceController.updatePromotionPrice
);

export default router;
