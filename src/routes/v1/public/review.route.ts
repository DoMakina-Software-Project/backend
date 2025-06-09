import { Router } from "express";
import ReviewController from "../../../controllers/review.controller";
import { ReviewValidator, throwValidationErrors } from "../validators";

const router = Router();

// Get reviews for a car
router.get(
	"/car/:carId",
	ReviewValidator.getCarReviews,
	throwValidationErrors,
	ReviewController.getCarReviews
);

// Get car rating
router.get(
	"/car/:carId/rating",
	ReviewValidator.getCarReviews,
	throwValidationErrors,
	ReviewController.getCarRating
);

export default router; 