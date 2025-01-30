import { Router } from "express";
import { BrandController } from "../../../controllers/admin/index.js";
import { BrandValidator, throwValidationErrors } from "../validators/index.js";

const router = Router();
router.get("/:id", BrandController.getBrand);
router.post(
	"/",
	BrandValidator.createBrand,
	throwValidationErrors,
	BrandController.createBrand
);
router.put(
	"/:id",
	BrandValidator.updateBrand,
	throwValidationErrors,
	BrandController.updateBrand
);
router.delete(
	"/:id",
	BrandValidator.deleteBrand,
	throwValidationErrors,
	BrandController.deleteBrand
);

export default router;
 