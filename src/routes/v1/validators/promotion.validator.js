import { body, param } from "express-validator";

export default {
	getPromotion: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
	],
	createPromotion: [
		body("carId").isInt().withMessage("CarID must be a number"),
		body("promotionDays")
			.isInt()
			.withMessage("Promotion days must be a number"),
	],
	updatePromotion: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
		body("carId").isNumeric().withMessage("CarID must be a number").toInt(),
		body("startDate")
			.isISO8601()
			.withMessage("Start date must be a valid date"),
		body("endDate")
			.isISO8601()
			.withMessage("End date must be a valid date"),
	],
	deletePromotion: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
	],
};
