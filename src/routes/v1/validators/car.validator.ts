import { body, param, query, ValidationChain } from "express-validator";

interface CarValidator {
	updateCar: ValidationChain[];
	createCar: ValidationChain[];
	deleteCar: ValidationChain[];
	getCar: ValidationChain[];
	searchCars: ValidationChain[];
	getWishlistCars: ValidationChain[];
	updateIsSold: ValidationChain[];
	deletePromotion: ValidationChain[];
	getUnverifiedCars: ValidationChain[];
	getCarForVerification: ValidationChain[];
	approveCar: ValidationChain[];
	rejectCar: ValidationChain[];
}

const CarValidator: CarValidator = {
	updateCar: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
		body("brandId")
			.optional()
			.isNumeric()
			.withMessage("brandId must be a number"),
		body("model")
			.optional()
			.isString()
			.withMessage("model must be a string")
			.isLength({ min: 2, max: 50 })
			.withMessage("model must be between 2 and 50 characters"),
		body("year")
			.optional()
			.isInt({ min: 1990, max: new Date().getFullYear() })
			.withMessage(
				`year must be between 1990 and ${new Date().getFullYear()}`
			),
		body("price")
			.optional()
			.isFloat({ min: 0 })
			.withMessage("price must be a positive number"),
		body("description")
			.optional()
			.isString()
			.withMessage("description must be a string")
			.isLength({ min: 10, max: 500 })
			.withMessage("description must be between 10 and 500 characters"),
		body("mileage")
			.optional()
			.isInt({ min: 0, max: 1000000 })
			.withMessage("mileage must be between 0 and 1,000,000"),
		body("fuelType")
			.optional()
			.isIn(["PETROL", "DIESEL", "ELECTRIC", "HYBRID", "OTHER"])
			.withMessage("fuelType must be a valid fuel type"),
		body("transmission")
			.optional()
			.isIn(["MANUAL", "AUTOMATIC", "SEMI_AUTOMATIC"])
			.withMessage("transmission must be a valid transmission type"),
		body("listingType")
			.optional()
			.isIn(["SALE", "RENT"])
			.withMessage("listingType must be a valid listing type"),
		body("status")
			.optional()
			.isIn(["ACTIVE", "SOLD", "HIDDEN"])
			.withMessage("status must be a valid status"),
		body("removedImageIds")
			.optional()
			.custom((value) => {
				if (value === undefined || value === "") return true;
				try {
					const parsed = JSON.parse(value);
					if (!Array.isArray(parsed)) {
						throw new Error("removedImageIds must be an array");
					}
					if (!parsed.every((id) => Number.isInteger(Number(id)))) {
						throw new Error(
							"All removedImageIds must be valid integers"
						);
					}
					return true;
				} catch (error) {
					throw new Error(
						"removedImageIds must be a valid JSON array of integers"
					);
				}
			}),
	],
	createCar: [
		body("brandId").isNumeric().withMessage("brandId must be a number"),
		body("model").isString().withMessage("model must be a string"),
		body("year").isInt().withMessage("year must be a number"),
		body("price").isFloat().withMessage("price must be a number"),
		body("description")
			.isString()
			.withMessage("description must be a string"),
		body("mileage")
			.optional()
			.isInt()
			.withMessage("mileage must be a number"),
		body("fuelType")
			.isIn(["PETROL", "DIESEL", "ELECTRIC", "HYBRID", "OTHER"])
			.withMessage("fuelType must be a valid fuel type"),
		body("transmission")
			.isIn(["MANUAL", "AUTOMATIC", "SEMI_AUTOMATIC"])
			.withMessage("transmission must be a valid transmission type"),
		body("listingType")
			.isIn(["SALE", "RENT"])
			.withMessage("listingType must be a valid listing type"),
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
		query("minYear")
			.optional({ values: "falsy" })
			.isInt({ min: 1990, max: new Date().getFullYear() })
			.withMessage(
				`Year must be between 1990 and ${new Date().getFullYear()}`
			),
		query("maxYear")
			.optional({ values: "falsy" })
			.isInt({ min: 1990, max: new Date().getFullYear() })
			.withMessage(
				`Year must be between 1990 and ${new Date().getFullYear()}`
			),
		query("minMileage")
			.optional({ values: "falsy" })
			.isInt({ min: 0 })
			.withMessage("Minimum mileage must be a positive number")
			.toInt(),
		query("maxMileage")
			.optional({ values: "falsy" })
			.isInt({ min: 0 })
			.withMessage("Maximum mileage must be a positive number")
			.toInt(),
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
						return Number(id);
					} else if (typeof id !== "number") {
						throw new Error("brandIds must be an array of numbers");
					}
					return id;
				});

				return true;
			}),
		query("modelSearch")
			.optional()
			.isString()
			.withMessage("modelSearch must be a string")
			.isLength({ min: 1, max: 50 })
			.withMessage("modelSearch must be between 1 and 50 characters"),
		query("city")
			.optional()
			.isString()
			.withMessage("city must be a string"),
		query("fuelType")
			.optional()
			.isIn(["PETROL", "DIESEL", "ELECTRIC", "HYBRID", "OTHER"])
			.withMessage("fuelType must be a valid fuel type"),
		query("transmission")
			.optional()
			.isIn(["MANUAL", "AUTOMATIC", "SEMI_AUTOMATIC"])
			.withMessage("transmission must be a valid transmission type"),
		query("page")
			.optional()
			.isInt()
			.withMessage("page must be a number")
			.toInt(),
		query("listingType")
			.optional()
			.isIn(["SALE", "RENT"])
			.withMessage("listingType must be either SALE or RENT"),
		query("startDate")
			.optional()
			.isISO8601()
			.withMessage("startDate must be a valid date"),
		query("endDate")
			.optional()
			.isISO8601()
			.withMessage("endDate must be a valid date"),
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
		body("status")
			.isIn(["ACTIVE", "SOLD", "HIDDEN"])
			.withMessage("status must be a valid status"),
	],
	deletePromotion: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
	],

	// New verification validators
	getUnverifiedCars: [
		query("page")
			.optional()
			.isInt({ min: 1 })
			.withMessage("page must be a positive integer")
			.toInt(),
		query("limit")
			.optional()
			.isInt({ min: 1, max: 50 })
			.withMessage("limit must be between 1 and 50")
			.toInt(),
		query("status")
			.optional()
			.isIn(["PENDING", "APPROVED", "REJECTED"])
			.withMessage("status must be PENDING, APPROVED, or REJECTED"),
	],
	getCarForVerification: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
	],
	approveCar: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
	],
	rejectCar: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
		body("reason")
			.optional()
			.isString()
			.withMessage("reason must be a string")
			.isLength({ max: 500 })
			.withMessage("reason must not exceed 500 characters"),
	],
};

export default CarValidator;
