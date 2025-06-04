import { body, param } from "express-validator";

export default {
	createStaffValidation: [
		body("email")
			.isEmail()
			.withMessage("Please provide a valid email address")
			.normalizeEmail(),
		body("name")
			.trim()
			.isLength({ min: 2, max: 100 })
			.withMessage("Name must be between 2 and 100 characters"),
		body("surname")
			.trim()
			.isLength({ min: 2, max: 100 })
			.withMessage("Surname must be between 2 and 100 characters"),
	],

	updateStaffValidation: [
		param("id").isInt().withMessage("Invalid staff ID"),
		body("name")
			.optional()
			.trim()
			.isLength({ min: 2, max: 100 })
			.withMessage("Name must be between 2 and 100 characters"),
		body("surname")
			.optional()
			.trim()
			.isLength({ min: 2, max: 100 })
			.withMessage("Surname must be between 2 and 100 characters"),
	],

	deleteStaffValidation: [
		param("id").isInt().withMessage("Invalid staff ID"),
	],

	getStaffByIdValidation: [
		param("id").isInt().withMessage("Invalid staff ID"),
	],
};
