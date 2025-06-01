import { Router } from "express";
import { AuthValidator, throwValidationErrors } from "../validators";
import { AuthController } from "../../../controllers/auth";
import { isAuth } from "../../../middlewares";

const router = Router();

router.get("/user", isAuth, AuthController.getUser);
router.get("/logout", isAuth, AuthController.logout);

router.post(
	"/login",
	AuthValidator.login,
	throwValidationErrors,
	AuthController.login
);
router.post(
	"/register",
	AuthValidator.register,
	throwValidationErrors,
	AuthController.register
);

router.get(
	"/generate-email-verification-token",
	isAuth,
	AuthController.generateEmailVerificationToken
);

router.get(
	"/verify-email/:token",
	AuthValidator.verifyEmail,
	throwValidationErrors,
	AuthController.verifyEmail
);

router.post(
	"/forget-password",
	AuthValidator.forgetPassword,
	throwValidationErrors,
	AuthController.forgetPassword
);
router.post(
	"/reset-password",
	AuthValidator.resetPassword,
	throwValidationErrors,
	AuthController.resetPassword
);

export default router;
