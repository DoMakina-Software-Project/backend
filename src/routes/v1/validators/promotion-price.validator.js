import { body, param } from "express-validator";

export default {
	createPromotionPrice: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
		body("price").isFloat().withMessage("Price must be a number"),
	],
	updatePromotionPrice: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
		body("price").isFloat().withMessage("Price must be a number"),
	],
	deletePromotionPrice: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
	],
};
