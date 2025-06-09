import { Router } from "express";
import { StaffBrandController } from "../../../controllers/staff";
import { uploadBrandIconMiddleware } from "../../../middlewares";
import { BrandValidator, throwValidationErrors } from "../validators";

const router = Router();

router.get("/", StaffBrandController.getAllBrands);
router.get("/:id", StaffBrandController.getBrand);
router.post(
	"/",
	uploadBrandIconMiddleware,
	BrandValidator.createBrand,
	throwValidationErrors,
	StaffBrandController.createBrand
);
router.put(
	"/:id",
	uploadBrandIconMiddleware,
	BrandValidator.updateBrand,
	throwValidationErrors,
	StaffBrandController.updateBrand
);
router.delete(
	"/:id",
	BrandValidator.deleteBrand,
	throwValidationErrors,
	StaffBrandController.deleteBrand
);

export default router;
