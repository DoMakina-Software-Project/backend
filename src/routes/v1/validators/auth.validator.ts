import { body, param, ValidationChain } from "express-validator";

interface AuthValidator {
	login: ValidationChain[];
	register: ValidationChain[];
	verifyEmail: ValidationChain[];
	forgetPassword: ValidationChain[];
	resetPassword: ValidationChain[];
}

const AuthValidator: AuthValidator = {
	login: [
		body("email")
			.isEmail()
			.withMessage("Invalid email format")
			.normalizeEmail(),

		body("password").isString().withMessage("Password must be a string"),
	],

	register: [
		body("name")
			.isString()
			.withMessage("Name must be a string")
			.isLength({ min: 2, max: 100 })
			.withMessage("Name must be between 2 and 100 characters long")
			.isAlpha()
			.withMessage("Name must contain only letters")
			.trim(),

		body("surname")
			.isString()
			.withMessage("Surname must be a string")
			.isLength({ min: 2, max: 100 })
			.withMessage("Surname must be between 2 and 100 characters long")
			.isAlpha()
			.withMessage("Surname must contain only letters")
			.trim(),

		body("email")
			.isEmail()
			.withMessage("Invalid email format")
			.normalizeEmail(),

		body("password")
			.isString()
			.withMessage("Password must be a string")
			.isLength({ min: 8 })
			.withMessage("Password must be at least 8 characters long")
			.isLength({ max: 100 })
			.withMessage("Password must be at most 100 characters long")
			.matches(/\d/)
			.withMessage("Password must contain at least one number")
			.matches(/[A-Z]/)
			.withMessage("Password must contain at least one uppercase letter")
			.matches(/[a-z]/)
			.withMessage("Password must contain at least one lowercase letter")
			.matches(/[@$!%*?&]/)
			.withMessage(
				"Password must contain at least one special character"
			),

		body("confirmPassword")
			.isString()
			.withMessage("Confirm password must be a string")
			.custom((value, { req }) => value === req.body.password)
			.withMessage("Passwords do not match"),

		body("acceptTerms")
			.isBoolean()
			.withMessage("Accept terms must be true or false")
			.custom((value) => value === true)
			.withMessage("You must accept the terms and conditions"),
	],

	verifyEmail: [
		param("token").isString().withMessage("Token must be a string"),
	],

	forgetPassword: [
		body("email")
			.isEmail()
			.withMessage("Invalid email format")
			.normalizeEmail(),
	],

	resetPassword: [
		body("password")
			.isString()
			.withMessage("Password must be a string")
			.isLength({ min: 8 })
			.withMessage("Password must be at least 8 characters long")
			.isLength({ max: 100 })
			.withMessage("Password must be at most 100 characters long")
			.matches(/\d/)
			.withMessage("Password must contain at least one number")
			.matches(/[A-Z]/)
			.withMessage("Password must contain at least one uppercase letter")
			.matches(/[a-z]/)
			.withMessage("Password must contain at least one lowercase letter")
			.matches(/[@$!%*?&]/)
			.withMessage(
				"Password must contain at least one special character"
			),

		body("confirmPassword")
			.isString()
			.withMessage("Confirm password must be a string")
			.custom((value, { req }) => value === req.body.password)
			.withMessage("Passwords do not match"),

		body("token").isString().withMessage("Token must be a string"),
	],
};

export default AuthValidator;
