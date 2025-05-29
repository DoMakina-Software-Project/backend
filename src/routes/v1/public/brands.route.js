import { Router } from "express";
import { BrandController } from "../../../controllers/public/index.js";
import { BrandValidator, throwValidationErrors } from "../validators/index.js";

const router = Router();

router.get("/", BrandController.getAllBrands);

export default router;
