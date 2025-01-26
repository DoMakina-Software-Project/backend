import { body, param } from "express-validator";

export default {
  getPrice: [
    param("id").isNumeric().withMessage("ID must be a number").toInt(),
  ],
  createPrice: [
    param("id").isNumeric().withMessage("ID must be a number").toInt(),
    body("price").isFloat().withMessage("Price must be a number"),
  ],
  updatePrice: [
    param("id").isNumeric().withMessage("ID must be a number").toInt(),
    body("price").isFloat().withMessage("Price must be a number"),
  ],
  deletePrice: [
    param("id").isNumeric().withMessage("ID must be a number").toInt(),
  ],
};
