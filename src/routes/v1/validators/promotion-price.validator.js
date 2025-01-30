import { body, param } from "express-validator";

export default {
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
