import { body, param, ValidationChain } from "express-validator";

interface WishlistValidator {
	addToWishlist: ValidationChain[];
	removeFromWishlist: ValidationChain[];
	isCarInWishlist: ValidationChain[];
}

const WishlistValidator: WishlistValidator = {
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