import crypto from "crypto";
import jwt from "jsonwebtoken";
import { UserService, TokenService, UserRoleService } from ".";
import { JWT_SECRET } from "../config/vars";
import { FRONTEND_URL } from "../config/vars";
import { sendEmail } from "../utils";

// Types
export type AuthStatus =
	| "OK"
	| "GENERAL_ERROR"
	| "INVALID_TOKEN"
	| "TIMEOUT_ERROR";

export interface AuthResponse {
	status: AuthStatus;
	message: string;
	token?: string;
	timeout?: number;
}

export interface RegisterResponse {
	status: AuthStatus;
	message: string;
}

const AuthService = {
	register: async (
		name: string,
		surname: string,
		email: string,
		password: string
	): Promise<RegisterResponse> => {
		try {
			const existingUser = await UserService.getUserByEmail(email);
			if (existingUser)
				return {
					status: "GENERAL_ERROR",
					message: "User already exists",
				};

			const { salt, hash } = AuthService.saltAndHashPassword(password);

			const newUser = await UserService.createUser({
				name,
				surname,
				email,
				password: hash,
				salt,
				status: "INACTIVE",
			});

			if (!newUser) {
				return {
					status: "GENERAL_ERROR",
					message: "Failed to create user",
				};
			}

			if (newUser.status === "INACTIVE") {
				const emailToken =
					await AuthService.generateEmailVerificationToken(
						newUser.id
					);

				if (emailToken.status === "OK" && emailToken.token) {
					const emailVerificationLink = `${FRONTEND_URL}/verify-email/${emailToken.token}`;

					sendEmail({
						to: email,
						subject: "Email verification",
						html: `Click <a href="${emailVerificationLink}">here</a> to verify your email address.`,
					});
				}
			}

			await UserRoleService.createUserRoles({
				userId: newUser.id,
				roles: ["CLIENT", "SELLER"],
			});

			return {
				status: "OK",
				message: "User created successfully",
			};
		} catch (error: any) {
			console.error("Error registering user:", error);
			return {
				status: "GENERAL_ERROR",
				message: "An error occurred while registering the user",
			};
		}
	},

	comparePasswords: (
		password: string,
		hash: string,
		salt: string
	): boolean => {
		const hashVerify = crypto
			.pbkdf2Sync(password, salt, 10000, 64, "sha512")
			.toString("hex");
		return hash === hashVerify;
	},

	saltAndHashPassword: (password: string): { salt: string; hash: string } => {
		const salt = crypto.randomBytes(32).toString("hex");
		const genHash = crypto
			.pbkdf2Sync(password, salt, 10000, 64, "sha512")
			.toString("hex");
		return { salt, hash: genHash };
	},

	generateEmailVerificationToken: async (
		userId: number
	): Promise<AuthResponse> => {
		try {
			const user = await UserService.getUserById(userId);
			if (!user) {
				return {
					status: "GENERAL_ERROR",
					message: "User not found",
				};
			}

			if (user.status === "ACTIVE") {
				return {
					status: "GENERAL_ERROR",
					message: "User already verified",
				};
			}

			const emailToken = await TokenService.getTokenByUserIdAndType(
				userId,
				"EMAIL"
			);

			let currentVersion = 0;
			const MAX_VERSION = 5;
			const ONE_MINUTE = 60 * 1000;

			if (emailToken) {
				try {
					jwt.verify(emailToken.token, JWT_SECRET);
					const decoded: any = jwt.decode(emailToken.token);
					if (
						!decoded ||
						decoded.version === undefined ||
						decoded.iat === undefined
					) {
						return {
							status: "GENERAL_ERROR",
							message: "Invalid token payload",
						};
					}
					currentVersion = decoded.version;
					const issuedAt = new Date(decoded.iat * 1000);
					const tokenAge = Date.now() - issuedAt.getTime();
					const timeout =
						(currentVersion < MAX_VERSION
							? currentVersion
							: MAX_VERSION) * ONE_MINUTE;
					if (tokenAge < timeout) {
						const remainingTime = timeout - tokenAge;
						const remainingSeconds = Math.floor(
							remainingTime / 1000
						);
						return {
							status: "TIMEOUT_ERROR",
							message: `Please wait ${remainingSeconds} seconds before requesting a new token`,
							timeout: remainingSeconds,
						};
					}
					currentVersion += 1;
				} catch (error) {
					currentVersion = 1;
				}
			} else {
				currentVersion = 1;
			}

			const token = jwt.sign(
				{ id: userId, version: currentVersion },
				JWT_SECRET,
				{ expiresIn: "4h" }
			);

			if (emailToken) {
				await TokenService.deleteTokenById(emailToken.id);
			}

			const newToken = await TokenService.createToken({
				userId,
				type: "EMAIL",
				token,
			});

			if (!newToken) {
				return {
					status: "GENERAL_ERROR",
					message: "Failed to update user",
				};
			}

			return { status: "OK", token, message: "Token generated" };
		} catch (error: any) {
			console.error("Error generating email verification token:", error);
			return {
				status: "GENERAL_ERROR",
				message:
					error.message ||
					"An error occurred while generating the token",
			};
		}
	},

	verifyEmailVerificationToken: async (
		token: string
	): Promise<AuthResponse> => {
		try {
			jwt.verify(token, JWT_SECRET);
		} catch (error) {
			return {
				status: "INVALID_TOKEN",
				message: "Invalid token or token expired",
			};
		}
		try {
			const decoded: any = jwt.decode(token);
			if (!decoded || !decoded.id) {
				return {
					status: "INVALID_TOKEN",
					message: "Invalid token",
				};
			}
			const { id } = decoded;
			const user = await UserService.getUserById(id);
			if (!user) {
				return {
					status: "INVALID_TOKEN",
					message: "Invalid token",
				};
			}
			if (user.status === "ACTIVE") {
				return {
					status: "OK",
					message: "User already verified",
				};
			}
			// Activate user
			await UserService.updateUserById(id, { status: "ACTIVE" });
			return {
				status: "OK",
				message: "Email verified successfully",
			};
		} catch (error: any) {
			console.error("Error verifying email:", error);
			return {
				status: "GENERAL_ERROR",
				message: "An error occurred while verifying email",
			};
		}
	},

	generatePasswordResetToken: async (
		email: string
	): Promise<AuthResponse> => {
		try {
			const user = await UserService.getUserByEmail(email);
			if (!user) {
				return {
					status: "GENERAL_ERROR",
					message: "User not found",
				};
			}

			const passwordToken = await TokenService.getTokenByUserIdAndType(
				user.id,
				"PASSWORD"
			);

			let currentVersion = 0;
			const MAX_VERSION = 5;
			const ONE_MINUTE = 60 * 1000;

			if (passwordToken) {
				try {
					jwt.verify(passwordToken.token, JWT_SECRET);
					const decoded: any = jwt.decode(passwordToken.token);
					if (
						!decoded ||
						decoded.version === undefined ||
						decoded.iat === undefined
					) {
						return {
							status: "GENERAL_ERROR",
							message: "Invalid token payload",
						};
					}
					currentVersion = decoded.version;
					const issuedAt = new Date(decoded.iat * 1000);
					const tokenAge = Date.now() - issuedAt.getTime();
					const timeout =
						(currentVersion < MAX_VERSION
							? currentVersion
							: MAX_VERSION) * ONE_MINUTE;
					if (tokenAge < timeout) {
						const remainingTime = timeout - tokenAge;
						const remainingSeconds = Math.floor(
							remainingTime / 1000
						);
						return {
							status: "TIMEOUT_ERROR",
							message: `Please wait ${remainingSeconds} seconds before requesting a new token`,
							timeout: remainingSeconds,
						};
					}
					currentVersion += 1;
				} catch (error) {
					currentVersion = 1;
				}
			} else {
				currentVersion = 1;
			}

			const token = jwt.sign(
				{ id: user.id, version: currentVersion },
				JWT_SECRET,
				{ expiresIn: "4h" }
			);

			if (passwordToken) {
				await TokenService.deleteTokenById(passwordToken.id);
			}

			const newToken = await TokenService.createToken({
				userId: user.id,
				type: "PASSWORD",
				token,
			});

			if (!newToken) {
				return {
					status: "GENERAL_ERROR",
					message: "Failed to create reset token",
				};
			}

			return { status: "OK", token, message: "Token generated" };
		} catch (error: any) {
			console.error("Error generating password reset token:", error);
			return {
				status: "GENERAL_ERROR",
				message:
					error.message ||
					"An error occurred while generating the token",
			};
		}
	},

	verifyResetTokenAndChangePassword: async (
		token: string,
		newPassword: string
	): Promise<AuthResponse> => {
		try {
			jwt.verify(token, JWT_SECRET);
		} catch (error) {
			return {
				status: "INVALID_TOKEN",
				message: "Invalid token or token expired",
			};
		}

		try {
			const decoded: any = jwt.decode(token);
			if (!decoded || !decoded.id) {
				return {
					status: "INVALID_TOKEN",
					message: "Invalid token",
				};
			}

			const { id } = decoded;
			const user = await UserService.getUserById(id);
			if (!user) {
				return {
					status: "INVALID_TOKEN",
					message: "Invalid token",
				};
			}

			const { salt, hash } = AuthService.saltAndHashPassword(newPassword);
			await UserService.updateUserById(id, { password: hash, salt });

			// Delete the used token
			const passwordToken = await TokenService.getTokenByToken(token);
			if (passwordToken) {
				await TokenService.deleteTokenById(passwordToken.id);
			}

			return {
				status: "OK",
				message: "Password reset successful",
			};
		} catch (error: any) {
			console.error("Error resetting password:", error);
			return {
				status: "GENERAL_ERROR",
				message: "An error occurred while resetting password",
			};
		}
	},

	generateRandomPassword: (length = 12) => {
		const charset =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
		let password = "";
		const randomBytes = crypto.randomBytes(length);
		for (let i = 0; i < length; i++) {
			password += charset[randomBytes[i] % charset.length];
		}
		return password;
	},
};

export default AuthService;
