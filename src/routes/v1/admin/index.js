import { Router } from "express";
import { AuthValidator, throwValidationErrors } from "../validators/index.js";
import Promotion from "../../../models/promotion.model.js";

router.use("promotion-price", PromotionPriceRoute);
