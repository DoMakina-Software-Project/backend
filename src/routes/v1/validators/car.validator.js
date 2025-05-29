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
			.optional({ values: "falsy" })
			.isFloat()
			.withMessage("minPrice must be a number")
			.toFloat(),
		query("maxPrice")
			.optional({ values: "falsy" })
			.isFloat()
			.withMessage("maxPrice must be a number")
			.toFloat(),
		query("brandIds")
			.optional()
			.isArray()
			.withMessage("brandIds must be an array")
			.custom((value) => {
				if (!Array.isArray(value)) {
					throw new Error("brandIds must be an array");
				}

				value.map((id) => {
					if (typeof id === "string" && /^\d+$/.test(id)) {
						return Number(id); // Convert numeric strings to numbers
					} else if (typeof id !== "number") {
						throw new Error("brandIds must be an array of numbers");
					}
					return id;
				});

				return true;
			}),

		query("page")
			.optional()
			.isInt()
			.withMessage("page must be a number")
			.toInt(),
	],
	getWishlistCars: [
		query("ids")
			.optional()
			.isArray()
			.withMessage("ids must be an array")
			.custom((value) => {
				if (!Array.isArray(value)) {
					throw new Error("ids must be an array");
				}

				value.map((id) => {
					if (typeof id === "string" && /^\d+$/.test(id)) {
						return Number(id); // Convert numeric strings to numbers
					} else if (typeof id !== "number") {
						throw new Error("ids must be an array of numbers");
					}
					return id;
				});

				return true;
			}),
	],

	updateIsSold: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
		body("isSold").isBoolean().withMessage("isSold must be a boolean"),
	],
	deletePromotion: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
	],
};
