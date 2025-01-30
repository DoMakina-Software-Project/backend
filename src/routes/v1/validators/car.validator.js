import { body, param, query } from "express-validator";

export default {
	updateCar: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
		body("price").isFloat().withMessage("Price must be a number"),
		body("isSold").isBoolean().withMessage("isSold must be a boolean"),
	],
	createCar: [
		body("description")
			.isString()
			.withMessage("description must be a string"),
		body("brandId").isNumeric().withMessage("brandId must be a number"),
		body("model").isString().withMessage("model must be a string"),
		body("price").isFloat().withMessage("price must be a number"),
		body("year").isInt().withMessage("year must be a number"),
	],
	deleteCar: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
	],
	getCar: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
	],
	searchCars: [
		query("minPrice")
			.optional()
			.isFloat()
			.withMessage("minPrice must be a number")
			.toFloat(),
		query("maxPrice")
			.optional()
			.isFloat()
			.withMessage("maxPrice must be a number")
			.toFloat(),
		query("brandIds")
			.optional()
			.isArray()
			.withMessage("brandIds must be an array")
			.custom((value) => {
				if (
					value.length >= 0 &&
					value.every((id) => typeof id === "number")
				) {
					return true;
				}
				throw new Error("brandIds must be an array of numbers");
			}),
		query("page")
			.optional()
			.isInt()
			.withMessage("page must be a number")
			.toInt(),
	],
};
