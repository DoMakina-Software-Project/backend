import { body, param, ValidationChain } from "express-validator";

interface PromotionPriceValidator {
	getPromotionPrice: ValidationChain[];
	createPromotionPrice: ValidationChain[];
	updatePromotionPrice: ValidationChain[];
	deletePromotionPrice: ValidationChain[];
}

const PromotionPriceValidator: PromotionPriceValidator = {
	getPromotionPrice: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
	],
	createPromotionPrice: [
		body("price").isFloat().withMessage("Price must be a number"),
	],
	updatePromotionPrice: [
		body("price").isFloat().withMessage("Price must be a number"),
	],
	deletePromotionPrice: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
	],
};

export default PromotionPriceValidator;
