import { Router } from "express";
import { CarController } from "../../../controllers/public/index.js";
import { CarValidator, throwValidationErrors } from "../validators/index.js";

const router = Router();

router.get("/:id", CarController.getCarById);

router.get(
	"/search",
	CarValidator.searchCars,
	throwValidationErrors,
	CarController.searchCars
);

router.get("/latest-promotions", CarController.getFiveLatestPromotionCars);

router.get("/home", CarController.getHomePageCars);

export default router;
