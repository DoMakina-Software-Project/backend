import { body, param, query } from "express-validator";

export default {
	updateCar: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
		body("price").isFloat().withMessage("Price must be a number"),
		body("isSold").isBoolean().withMessage("isSold must be a boolean"),
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
};
