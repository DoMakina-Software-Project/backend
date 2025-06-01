import { Request, Response, NextFunction } from "express";
import { AuthService, SellerProfileService } from "../../services";
import passport from "../../config/passport";
import { sendEmail } from "../../utils";
import { FRONTEND_URL } from "../../config/vars";
import type { UserWithRoles } from "../../services/user.service";

const AuthController = {
	login: (req: Request, res: Response, next: NextFunction): void => {
		passport.authenticate(
			"local",
			async (err: Error | null, user: UserWithRoles | null) => {
				if (err) {
					res.status(400).json({ message: err.message });
					return;
				}

				if (!user) {
					res.status(400).json({ message: "Invalid credentials" });
					return;
				}

				req.login(user, (err) => {
					if (err) {
						res.status(400).json({ message: err.message });
						return;
					}

					res.status(200).json({ message: "User logged in" });
				});
			}
		)(req, res, next);
	},

	register: async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const { name, surname, email, password } = req.body;

			const response = await AuthService.register(
				name,
				surname,
				email,
				password
			);

			if (response.status !== "OK") {
				res.status(400).json({ message: response.message });
				return;
			}

			passport.authenticate(
				"local",
				(err: Error | null, user: UserWithRoles | null) => {
					if (err) {
						res.status(400).json({ message: err.message });
						return;
					}
					if (!user) {
						res.status(401).json({
							message: "Authentication failed",
						});
						return;
					}
					req.login(user, async (err) => {
						if (err) {
							res.status(400).json({ message: err.message });
							return;
						}

						res.status(200).json({
							message: "Registration and login successful",
						});
					});
				}
			)(req, res, next);
		} catch (error) {
			next(error);
		}
	},

	logout: async (req: Request, res: Response): Promise<void> => {
		req.logout((error) => {
			if (error) {
				res.status(400).json({ message: error.message });
				return;
			}

			res.status(200).json({ message: "User logged out" });
		});
	},

	getUser: async (req: Request, res: Response): Promise<void> => {
		const user = req.user as UserWithRoles;
		if (!user) {
			res.status(401).json({ message: "User not found" });
			return;
		}

		if (user.roles.includes("SELLER")) {
			const sellerProfile =
				await SellerProfileService.getSellerProfileByUserId(user.id);

			res.status(200).json({
				...user,
				sellerProfile,
			});
			return;
		}

		res.status(200).json(user);
	},

	generateEmailVerificationToken: async (
		req: Request,
		res: Response
	): Promise<void> => {
		const user = req.user as UserWithRoles;

		if (!user) {
			res.status(401).json({ message: "User not found" });
			return;
		}

		const token = await AuthService.generateEmailVerificationToken(user.id);

		if (token.status !== "OK") {
			res.status(400).json({
				message: token.message,
				...(token.status === "TIMEOUT_ERROR" && {
					timeout: token.timeout,
				}),
			});
			return;
		}

		const verifyEmailLink = `${FRONTEND_URL}/verify-email/${token.token}`;

		sendEmail({
			to: user.email,
			subject: "Verify Your Account",
			html: `Click <a href="${verifyEmailLink}">here</a> to verify your email address.`,
		});

		res.status(200).json({ message: "Verification email sent" });
	},

	verifyEmail: async (req: Request, res: Response): Promise<void> => {
		const { token } = req.params;

		const { status, message } =
			await AuthService.verifyEmailVerificationToken(token);

		if (status !== "OK") {
			res.status(400).json({ message });
			return;
		}

		res.status(200).json({ message: "Email verified" });
	},

	forgetPassword: async (req: Request, res: Response): Promise<void> => {
		const { email } = req.body;

		const response = await AuthService.generatePasswordResetToken(email);

		if (response.status !== "OK") {
			res.status(400).json({ message: response.message });
			return;
		}

		const resetPasswordLink = `${FRONTEND_URL}/reset-password/${response.token}`;

		sendEmail({
			to: email,
			html: `Click <a href="${resetPasswordLink}">here</a> to reset your password.`,
			subject: "Reset Your Password",
		});

		res.status(200).json({ message: "Password reset email sent" });
	},

	resetPassword: async (req: Request, res: Response): Promise<void> => {
		const { password, token } = req.body;

		const response = await AuthService.verifyResetTokenAndChangePassword(
			token,
			password
		);

		if (response.status !== "OK") {
			res.status(400).json({ message: response.message });
			return;
		}

		res.status(200).json({ message: "Password reset successful" });
	},
};

export default AuthController;
