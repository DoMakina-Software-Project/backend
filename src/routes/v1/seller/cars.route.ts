import { Router } from "express";
import { SellerCarController } from "../../../controllers/seller";
import { CarValidator, throwValidationErrors } from "../validators";
import { uploadCarImagesMiddleware } from "../../../middlewares";

const router = Router();

router.get("/", SellerCarController.getUserCars);

// Get verification statistics for the seller
router.get("/verification/stats", SellerCarController.getVerificationStats);

router.post(
	"/",
	uploadCarImagesMiddleware,
	CarValidator.createCar,
	throwValidationErrors,
	SellerCarController.createCar
);

router.put(
	"/:id",
	CarValidator.updateCar,
	throwValidationErrors,
	SellerCarController.updateCar
);

router.delete(
	"/:id",
	CarValidator.deleteCar,
	throwValidationErrors,
	SellerCarController.deleteCar
);

router.get(
	"/:id",
	CarValidator.getCar,
	throwValidationErrors,
	SellerCarController.getCar
);
router.delete(
	"/:id/promotion",
	CarValidator.deletePromotion,
	throwValidationErrors,
	SellerCarController.deletePromotion
);

router.put(
	"/:id/is-sold",
	CarValidator.updateIsSold,
	throwValidationErrors,
	SellerCarController.updateIsSold
);

export default router;
