import { Router } from "express";
import { ProfileController } from "../../../controllers/seller/index.js";
import {
	SellerProfileValidator,
	throwValidationErrors,
} from "../validators/index.js";

const router = Router();

router.post(
	"/",
	SellerProfileValidator.createSellerProfile,
	throwValidationErrors,
	ProfileController.createSellerProfile
);

export default router;
