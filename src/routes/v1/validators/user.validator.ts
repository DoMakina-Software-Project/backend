import { body, param, query } from "express-validator";

export const getUserByIdValidation = [
	param("id").isNumeric().withMessage("ID must be a number").toInt(),
];

export const getUsersByRoleValidation = [
	param("role")
		.isIn(["CLIENT", "SELLER", "STAFF", "SUPERADMIN"])
		.withMessage("Role must be one of: CLIENT, SELLER, STAFF, SUPERADMIN"),
	query("page")
		.optional()
		.isNumeric()
		.withMessage("Page must be a number")
		.toInt(),
];

export const getAllUsersValidation = [
	query("page")
		.optional()
		.isNumeric()
		.withMessage("Page must be a number")
		.toInt(),
	query("role")
		.optional()
		.isIn(["CLIENT", "SELLER", "STAFF", "SUPERADMIN"])
		.withMessage("Role must be one of: CLIENT, SELLER, STAFF, SUPERADMIN"),
];

export const updateUserStatusValidation = [
	param("id").isNumeric().withMessage("ID must be a number").toInt(),
	body("status")
		.isIn(["ACTIVE", "INACTIVE", "BANNED", "DELETED"])
		.withMessage(
			"Status must be one of: ACTIVE, INACTIVE, BANNED, DELETED"
		),
];

export const banUserValidation = [
	param("id").isNumeric().withMessage("ID must be a number").toInt(),
];

export const unbanUserValidation = [
	param("id").isNumeric().withMessage("ID must be a number").toInt(),
];

export const updateUserValidation = [
	param("id").isNumeric().withMessage("ID must be a number").toInt(),
	body("name")
		.optional()
		.isLength({ min: 2, max: 100 })
		.withMessage("Name must be between 2 and 100 characters")
		.trim(),
	body("surname")
		.optional()
		.isLength({ min: 2, max: 100 })
		.withMessage("Surname must be between 2 and 100 characters")
		.trim(),
	body("email")
		.optional()
		.isEmail()
		.withMessage("Please provide a valid email address")
		.normalizeEmail(),
];
