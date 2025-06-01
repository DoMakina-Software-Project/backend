import { Router } from "express";
import { SellerProfileController } from "../../../controllers/seller";
import { SellerProfileValidator, throwValidationErrors } from "../validators";

const router = Router();

router.post(
	"/",
	SellerProfileValidator.createSellerProfile,
	throwValidationErrors,
	SellerProfileController.createSellerProfile
);

export default router;
