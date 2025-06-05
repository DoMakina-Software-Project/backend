import { Router } from "express";
import { SellerRentalAvailabilityController } from "../../../controllers/seller";
import {
	RentalAvailabilityValidator,
	throwValidationErrors,
} from "../validators";

const router = Router();

router.post(
	"/add",
	RentalAvailabilityValidator.addAvailability,
	throwValidationErrors,
	SellerRentalAvailabilityController.addAvailability
);
router.post(
	"/remove",
	RentalAvailabilityValidator.removeAvailability,
	throwValidationErrors,
	SellerRentalAvailabilityController.removeAvailability
);
router.post(
	"/available-dates",
	RentalAvailabilityValidator.getAvailableDatesInRange,
	throwValidationErrors,
	SellerRentalAvailabilityController.getAvailableDatesInRange
);

export default router;
