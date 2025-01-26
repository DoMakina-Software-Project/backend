import { Router } from "express";
import { PromotionPriceController } from "../../../controllers/admin/index.js";
import {
  PromotionPriceValidator,
  throwValidationErrors,
} from "../validators/index.js";

const router = Router();
router.get(
  "/:id",
  PromotionPriceValidator.getPromotionPrice,
  throwValidationErrors,
  PromotionPriceController.getPromotionPrice
);
router.post(
  "/:id",
  PromotionPriceValidator.createPromotionPrice,
  throwValidationErrors,
  PromotionPriceController.createPromotionPrice
);
router.put(
  "/:id",
  PromotionPriceValidator.updatePromotionPrice,
  throwValidationErrors,
  PromotionPriceController.updatePromotionPrice
);
router.delete(
  "/:id",
  PromotionPriceValidator.deletePromotionPrice,
  throwValidationErrors,
  PromotionPriceController.deletePromotionPrice
);

export default router;
