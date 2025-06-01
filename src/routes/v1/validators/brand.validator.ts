import { body, param, ValidationChain } from "express-validator";

interface BrandValidator {
	createBrand: ValidationChain[];
	updateBrand: ValidationChain[];
	deleteBrand: ValidationChain[];
}

const BrandValidator: BrandValidator = {
	createBrand: [body("name").isString().withMessage("Name must be a string")],
	updateBrand: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
		body("name").isString().withMessage("Name must be a string"),
	],
	deleteBrand: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
	],
};

export default BrandValidator;
