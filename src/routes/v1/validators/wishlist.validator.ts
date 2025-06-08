import { body, param, query, ValidationChain } from "express-validator";

interface WishlistValidator {
	getUserWishlist: ValidationChain[];
	addToWishlist: ValidationChain[];
	removeFromWishlist: ValidationChain[];
	isCarInWishlist: ValidationChain[];
}

const WishlistValidator: WishlistValidator = {
	getUserWishlist: [
		query("page")
			.optional()
			.isInt({ min: 1 })
			.withMessage("page must be a positive integer")
			.toInt(),
	],
	addToWishlist: [
		body("carId")
			.isNumeric()
			.withMessage("carId must be a number")
			.toInt(),
	],
	removeFromWishlist: [
		param("carId")
			.isNumeric()
			.withMessage("carId must be a number")
			.toInt(),
	],
	isCarInWishlist: [
		param("carId")
			.isNumeric()
			.withMessage("carId must be a number")
			.toInt(),
	],
};

export default WishlistValidator; 