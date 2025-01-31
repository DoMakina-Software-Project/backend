import { body, param } from "express-validator";

export default {
	createBrand: [body("name").isString().withMessage("Name must be a string")],
	updateBrand: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
		body("name").isString().withMessage("Name must be a string"),
	],
	deleteBrand: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
	],
};
