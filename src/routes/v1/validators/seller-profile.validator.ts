import { ValidationChain } from "express-validator";

interface SellerProfileValidator {
	createSellerProfile: ValidationChain[];
}

const SellerProfileValidator: SellerProfileValidator = {
	createSellerProfile: [],
};

export default SellerProfileValidator;
