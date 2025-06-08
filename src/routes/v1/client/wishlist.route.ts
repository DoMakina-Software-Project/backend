import { Router } from "express";
import { WishlistController } from "../../../controllers/client";
import { WishlistValidator, throwValidationErrors } from "../validators";
import { isClient } from "../../../middlewares";

const router = Router();

// Get user's wishlist
router.get("/", isClient, WishlistController.getUserWishlist);

// Add car to wishlist
router.post(
	"/",
	isClient,
	WishlistValidator.addToWishlist,
	throwValidationErrors,
	WishlistController.addToWishlist
);

// Remove car from wishlist
router.delete(
	"/:carId",
	isClient,
	WishlistValidator.removeFromWishlist,
	throwValidationErrors,
	WishlistController.removeFromWishlist
);

// Check if car is in wishlist
router.get(
	"/check/:carId",
	isClient,
	WishlistValidator.isCarInWishlist,
	throwValidationErrors,
	WishlistController.isCarInWishlist
);

// Clear entire wishlist
router.delete("/", isClient, WishlistController.clearWishlist);

export default router; 