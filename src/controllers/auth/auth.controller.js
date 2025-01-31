import {
	UserService,
	AuthService,
	UserRoleService,
} from "../../services/index.js";
import passport from "../../config/passport.js";
import { sendEmail } from "../../utils/index.js";
import { FRONTEND_URL } from "../../config/vars.js";

export default {
	login: (req, res, next) => {
		passport.authenticate("local", (err, user) => {
			if (err) {
				return res.status(400).json({ message: err.message });
			}

			if (!user) {
				return res.status(400).json({ message: "Invalid credentials" });
			}

			req.login(user, (err) => {
				if (err) {
					return res.status(400).json({ message: err.message });
				}

				return res.status(200).json({ message: "User logged in" });
			});
		})(req, res, next);
	},

	register: async (req, res, next) => {
		try {
			const { name, surname, email, password } = req.body;

			const existingUser = await UserService.getUserByEmail(email);
			if (existingUser)
				return res.status(400).json({ message: "User already exists" });

			const { hash, salt } = AuthService.saltAndHashPassword(password);

			const user = await UserService.createUser({
				name,
				surname,
				email,
				password: hash,
				salt,
				isActive: false,
			});

			if (!user)
				return res
					.status(400)
					.json({ message: "User could not be created" });

			const userRole = await UserRoleService.createUserRole({
				userId: user.id,
				role: "user",
			});

			if (!userRole) {
				return res
					.status(400)
					.json({ message: "User role could not be created" });
			}

			if (!user.isActive) {
				const emailToken =
					await AuthService.generateEmailVerificationToken(user.id);

				if (emailToken.status === "OK") {
					const emailVerificationLink = `${FRONTEND_URL}/verify-email/${emailToken.token}`;

					sendEmail({
						to: email,
						subject: "Email verification",
						html: `Click <a href="${emailVerificationLink}">here</a> to verify your email address.`,
					});
				}
			}

			passport.authenticate("local", (err, user) => {
				if (err) {
					return res.status(400).json({ message: err.message });
				}
				if (!user) {
					return res
						.status(401)
						.json({ message: "Authentication failed" });
				}
				req.login(user, async (err) => {
					if (err) {
						return res.status(400).json({ message: err.message });
					}

					res.status(200).json({
						message: "Registration and login successful",
					});
				});
			})(req, res, next);
		} catch (error) {
			next(error);
		}
	},

	logout: async (req, res) => {
		req.logout((error) => {
			if (error) {
				return res.status(400).json({ message: error.message });
			}

			return res.status(200).json({ message: "User logged out" });
		});
	},

	getUser: async (req, res) => {
		const user = req.user;
		if (!user) return res.status(401).json({ message: "User not found" });

		return res.status(200).json(user);
	},

	generateEmailVerificationToken: async (req, res) => {
		const user = req.user;

		if (!user) {
			return res.status(401).json({ message: "User not found" });
		}

		const token = await AuthService.generateEmailVerificationToken(user.id);

		if (token.status !== "OK") {
			return res.status(400).json({
				message: token.message,
				...(token.status === "TIMEOUT_ERROR" && {
					timeout: token.timeout,
				}),
			});
		}

		const verifyEmailLink = `${FRONTEND_URL}/verify-email/${token.token}`;

		sendEmail({
			to: user.email,
			subject: "Verify Your Account",
			html: `Click <a href="${verifyEmailLink}">here</a> to verify your email address.`,
		});

		return res.status(200).json({ message: "Verification email sent" });
	},

	verifyEmail: async (req, res) => {
		const { token } = req.params;

		const { status, message } =
			await AuthService.verifyEmailVerificationToken(token);

		if (status !== "OK") {
			return res.status(400).json({ message });
		}

		return res.status(200).json({ message: "Email verified" });
	},

	forgetPassword: async (req, res) => {
		const { email } = req.body;

		const response = await AuthService.generatePasswordResetToken(email);

		if (response.status !== "OK") {
			return res.status(400).json({ message: response.message });
		}

		const resetPasswordLink = `${FRONTEND_URL}/reset-password/${response.token}`;

		sendEmail({
			to: email,
			html: `Click <a href="${resetPasswordLink}">here</a> to reset your password.`,
			subject: "Reset Your Password",
		});

		return res.status(200).json({ message: "Password reset email sent" });
	},

	resetPassword: async (req, res) => {
		const { password, token } = req.body;

		const response = await AuthService.verifyResetTokenAndChangePassword(
			token,
			password
		);

		if (response.status !== "OK") {
			return res.status(400).json({ message: response.message });
		}

		return res.status(200).json({ message: "Password reset successful" });
	},
};
