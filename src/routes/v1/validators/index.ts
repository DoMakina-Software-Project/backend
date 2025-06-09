import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export { default as AuthValidator } from "./auth.validator";
export { default as PromotionPriceValidator } from "./promotion-price.validator";
export { default as CarValidator } from "./car.validator";
export { default as PromotionValidator } from "./promotion.validator";
export { default as BrandValidator } from "./brand.validator";
export { default as SellerProfileValidator } from "./seller-profile.validator";
export { default as StaffValidator } from "./staff.validator";
export { default as RentalAvailabilityValidator } from "./rental-availability.validator";
export { default as BookingValidator } from "./booking.validator";
export { default as WishlistValidator } from "./wishlist.validator";
export { default as ReviewValidator } from "./review.validator";

export const throwValidationErrors = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		next();
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
};
