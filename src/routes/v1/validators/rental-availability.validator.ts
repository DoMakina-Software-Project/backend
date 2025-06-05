import { body } from "express-validator";

export default {
	addAvailability: [
		body("carId").isInt().withMessage("Car ID is required"),
		body("periods").isArray().withMessage("Periods is required"),
		body("periods.*.startDate")
			.isISO8601()
			.toDate()
			.withMessage("Start date is required"),
		body("periods.*.endDate")
			.isISO8601()
			.toDate()
			.withMessage("End date is required"),
	],
	removeAvailability: [
		body("carId").isInt().withMessage("Car ID is required"),
		body("periods").isArray().withMessage("Periods is required"),
		body("periods.*.startDate")
			.isISO8601()
			.toDate()
			.withMessage("Start date is required"),
	],

	getAvailableDatesInRange: [
		body("carId").isInt().withMessage("Car ID is required"),
		body("startDate")
			.isISO8601()
			.toDate()
			.withMessage("Start date is required"),
		body("endDate")
			.isISO8601()
			.toDate()
			.withMessage("End date is required"),
	],
};
