import { body, param, query, ValidationChain } from "express-validator";

interface ReviewValidator {
	createReview: ValidationChain[];
	getCarReviews: ValidationChain[];
	getBookingById: ValidationChain[];
}

const ReviewValidator: ReviewValidator = {
	createReview: [
		body("carId").isInt().withMessage("Car ID is required"),
		body("bookingId").isInt().withMessage("Booking ID is required"),
		body("rating")
			.isInt({ min: 1, max: 5 })
			.withMessage("Rating must be between 1 and 5"),
		body("comment")
			.isString()
			.trim()
			.isLength({ min: 1, max: 1000 })
			.withMessage("Comment must be between 1 and 1000 characters"),
	],

	getCarReviews: [
		param("carId").isInt().withMessage("Car ID is required"),
		query("page")
			.optional()
			.isInt({ min: 1 })
			.withMessage("Page must be a positive number"),
		query("limit")
			.optional()
			.isInt({ min: 1, max: 50 })
			.withMessage("Limit must be between 1 and 50"),
	],

	getBookingById: [
		param("bookingId").isInt().withMessage("Booking ID is required"),
	],
};

export default ReviewValidator; 