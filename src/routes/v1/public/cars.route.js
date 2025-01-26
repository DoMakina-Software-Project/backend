import { Router } from "express";
import { CarController } from "../../../controllers/public/index.js";
import { CarValidator, throwValidationErrors } from "../validators/index.js";

const router = Router();

router.get(
	"/search",
	CarValidator.searchCars,
	throwValidationErrors,
	CarController.searchCars
);

router.get("/latest-promotions", CarController.getFiveLatestPromotionCars);

export default router;
