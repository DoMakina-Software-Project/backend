import { body, param } from "express-validator";

export default {
	updateCar: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
		body("price").isFloat().withMessage("Price must be a number"),
		body("isSold").isBoolean().withMessage("isSold must be a boolean"),
	],
	deleteCar: [
		param("id").isNumeric().withMessage("ID must be a number").toInt(),
	],
};
