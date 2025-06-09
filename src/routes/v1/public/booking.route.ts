import { Router } from "express";
import BookingController from "../../../controllers/booking.controller";
import { BookingValidator, throwValidationErrors } from "../validators";

const router = Router();

// Check availability (public endpoint - no authentication required)
router.post(
	"/check-availability",
	BookingValidator.checkAvailability,
	throwValidationErrors,
	BookingController.checkAvailability
);

export default router;
