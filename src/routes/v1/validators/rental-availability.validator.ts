import { body } from "express-validator";

export default {
	addAvailability: [
		body("carId").isInt().withMessage("Car ID is required"),
		body("periods").isArray().withMessage("Periods is required"),
		body("periods.*.startDate")
			.isDate()
			.withMessage("Start date is required"),
		body("periods.*.endDate").isDate().withMessage("End date is required"),
	],
	removeAvailability: [
		body("carId").isInt().withMessage("Car ID is required"),
		body("periods").isArray().withMessage("Periods is required"),
		body("periods.*.startDate")
			.isDate()
			.withMessage("Start date is required"),
	],

	getAvailableDatesInRange: [
		body("carId").isInt().withMessage("Car ID is required"),
		body("startDate").isDate().withMessage("Start date is required"),
		body("endDate").isDate().withMessage("End date is required"),
	],
};
