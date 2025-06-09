import { Router } from "express";
import ReviewController from "../../../controllers/review.controller";
import { ReviewValidator, throwValidationErrors } from "../validators";

const router = Router();

// Create a new review
router.post(
	"/",
	ReviewValidator.createReview,
	throwValidationErrors,
	ReviewController.createReview
);

// Check if user can review a booking
router.get(
	"/can-review/:bookingId",
	ReviewValidator.getBookingById,
	throwValidationErrors,
	ReviewController.canReviewBooking
);

export default router; 