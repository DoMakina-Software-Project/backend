import { Router } from "express";
import { CarController } from "../../../controllers/seller/index.js";
import { CarValidator, throwValidationErrors } from "../validators/index.js";
import { uploadCarImagesMiddleware } from "../../../middlewares/index.js";

const router = Router();

router.get("/", CarController.getUserCars);

router.post(
	"/",
	uploadCarImagesMiddleware,
	CarValidator.createCar,
	throwValidationErrors,
	CarController.createCar
);

router.put(
	"/:id",
	CarValidator.updateCar,
	throwValidationErrors,
	CarController.updateCar
);

router.delete(
	"/:id",
	CarValidator.deleteCar,
	throwValidationErrors,
	CarController.deleteCar
);

router.get(
	"/:id",
	CarValidator.getCar,
	throwValidationErrors,
	CarController.getCar
);
router.delete(
	"/:id/promotion",
	CarValidator.deletePromotion,
	throwValidationErrors,
	CarController.deletePromotion
);

router.put(
	"/:id/is-sold",
	CarValidator.updateIsSold,
	throwValidationErrors,
	CarController.updateIsSold
);

export default router;
