import { validationResult } from "express-validator";
export { default as AuthValidator } from "./auth.validator.js";

export const throwValidationErrors = (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		next();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
