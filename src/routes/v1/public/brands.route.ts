import { Router } from "express";
import { BrandController } from "../../../controllers/public";

const router = Router();

router.get("/", BrandController.getAllBrands);
router.get("/simple", BrandController.getAllBrandsSimple);

export default router;
