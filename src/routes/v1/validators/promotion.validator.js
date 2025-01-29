import { body, param } from "express-validator";

export default {
	getPromotion: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
	],
	createPromotion: [
		body("carId")
			.isNumeric()
			.withMessage("Brand ID must be a number")
			.toInt(),
		body("startDate")
			.isISO8601()
			.withMessage("Start date must be a valid date"),
		body("endDate")
			.isISO8601()
			.withMessage("End date must be a valid date"),
	],
	updatePromotion: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
		body("carId")
			.isNumeric()
			.withMessage("Brand ID must be a number")
			.toInt(),
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
