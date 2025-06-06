import { Router } from "express";
import { CarController } from "../../../controllers/public";
import { CarValidator, throwValidationErrors } from "../validators";

const router = Router();

router.get(
	"/search",
	CarValidator.searchCars,
	throwValidationErrors,
	CarController.searchCars
);
router.get(
	"/wishlist",
	CarValidator.getWishlistCars,
	throwValidationErrors,
	CarController.getCarsByIds
);

router.get("/latest-promotions", CarController.getFiveLatestPromotionCars);

router.get("/home", CarController.getHomePageCars);

router.get("/:id", CarController.getCarById);

export default router;
