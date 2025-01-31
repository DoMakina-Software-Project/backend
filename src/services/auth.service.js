import crypto from "crypto";
import jwt from "jsonwebtoken";
import { UserService, TokenService } from "./index.js";
import { JWT_SECRET } from "../config/vars.js";
const AuthService = {
	comparePasswords: (password, hash, salt) => {
		const hashVerify = crypto
			.pbkdf2Sync(password, salt, 10000, 64, "sha512")
			.toString("hex");
		return hash === hashVerify;
	},

	saltAndHashPassword: (password) => {
		const salt = crypto.randomBytes(32).toString("hex");
		const genHash = crypto
			.pbkdf2Sync(password, salt, 10000, 64, "sha512")
			.toString("hex");

		return {
			salt: salt,
			hash: genHash,
		};
	},

	generateEmailVerificationToken: async (userId) => {
		try {
			const user = await UserService.getUserById(userId);
			if (!user) {
				return {
					status: "GENERAL_ERROR",
					message: "User not found",
				};
			}

			if (user.isActive) {
				return {
					status: "GENERAL_ERROR",
					message: "User already verified",
				};
			}

			const emailToken = await TokenService.getTokenByUserIdAndType(
				userId,
				"email"
			);

			let currentVersion = 0;
			const MAX_VERSION = 5;
			const ONE_MINUTE = 60 * 1000;

			if (emailToken) {
				try {
					// Verifying the token first
					jwt.verify(emailToken.token, JWT_SECRET);

					// Decode token payload
					const decoded = jwt.decode(emailToken.token);

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

					// Extract version and issuedAt from decoded token
					currentVersion = decoded.version;

					const issuedAt = new Date(decoded.iat * 1000);
					const tokenAge = Date.now() - issuedAt.getTime();

					// Calculate timeout based on the version
					const timeout =
						(currentVersion < MAX_VERSION
							? currentVersion
							: MAX_VERSION) * ONE_MINUTE;

					if (tokenAge < timeout) {
						// If token age is less than the timeout, throw an error
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

					// Increment the version if generating a new token
					currentVersion += 1;
				} catch (error) {
					// If token is invalid or expired, proceed to generate a new one
					console.warn(
						"Existing token is invalid or expired, generating a new one."
					);
					currentVersion = 1;
				}
			} else {
				// Start at version 1 if no token exists
				currentVersion = 1;
			}

			// Generate a new token with the incremented version
			const token = jwt.sign(
				{
					id: userId,
					version: currentVersion,
				},
				JWT_SECRET,
				{
					expiresIn: "4h",
				}
			);

			if (emailToken) {
				await TokenService.deleteTokenById(emailToken.id);
			}

			const newToken = await TokenService.createToken({
				userId,
				type: "email",
				token,
			});

			if (!newToken) {
				return {
					status: "GENERAL_ERROR",
					message: "Failed to update user",
				};
			}

			return { status: "OK", token };
		} catch (error) {
			console.error("Error generating email verification token:", error);
			return {
				status: "GENERAL_ERROR",
				message:
					error.message ||
					"An error occurred while generating the token",
			};
		}
	},
	verifyEmailVerificationToken: async (token) => {
		try {
			jwt.verify(token, JWT_SECRET);
		} catch (error) {
			return {
				status: "INVALID_TOKEN",
				message: "Invalid token or token expired",
			};
		}

		try {
			const decoded = jwt.decode(token);

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

			if (user.isActive) {
				return {
					status: "OK",
					message: "User already verified",
				};
			}

			const emailToken = await TokenService.getTokenByUserIdAndType(
				id,
				"email"
			);

			if (emailToken?.token !== token) {
				return {
					status: "INVALID_TOKEN",
					message: "Invalid token",
				};
			}

			const updatedUser = await UserService.updateUserById(id, {
				isActive: true,
			});

			if (!updatedUser) {
				return {
					status: "GENERAL_ERROR",
					message: "Failed to update user",
				};
			}

			const isDeleted = await TokenService.deleteTokenById(emailToken.id);

			if (!isDeleted) {
				return {
					status: "GENERAL_ERROR",
					message: "Failed to update user",
				};
			}

			return {
				status: "OK",
				message: "Email verified",
			};
		} catch (error) {
			console.error("Error verifying email verification token:", error);
			return {
				status: "GENERAL_ERROR",
				message:
					error.message ||
					"An error occurred while verifying the token",
			};
		}
	},

	generatePasswordResetToken: async (email) => {
		try {
			const user = await UserService.getUserByEmail(email);

			if (!user) {
				return {
					status: "GENERAL_ERROR",
					message: "User not found",
				};
			}

			let currentVersion = 0;
			const MAX_VERSION = 5;
			const ONE_MINUTE = 60 * 1000;

			const existingToken = await TokenService.getTokenByUserIdAndType(
				user.id,
				"password"
			);

			if (existingToken) {
				try {
					// Verifying the token first
					jwt.verify(existingToken.token, JWT_SECRET);

					// Decode token payload
					const decoded = jwt.decode(existingToken.token);

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

					// Extract version and issuedAt from decoded token
					currentVersion = decoded.version;

					const issuedAt = new Date(decoded.iat * 1000);
					const tokenAge = Date.now() - issuedAt.getTime();

					// Calculate timeout based on the version
					const timeout =
						(currentVersion < MAX_VERSION
							? currentVersion
							: MAX_VERSION) * ONE_MINUTE;

					if (tokenAge < timeout) {
						// If token age is less than the timeout, throw an error
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

					// Increment the version if generating a new token
					currentVersion += 1;
				} catch (error) {
					// If token is invalid or expired, proceed to generate a new one
					console.warn(
						"Existing token is invalid or expired, generating a new one."
					);
					currentVersion = 1;
				}
			} else {
				// Start at version 1 if no token exists
				currentVersion = 1;
			}

			// Generate a new token with the incremented version
			const token = jwt.sign(
				{
					id: user.id,
					version: currentVersion,
				},
				JWT_SECRET,
				{
					expiresIn: "4h",
				}
			);

			if (existingToken) {
				await TokenService.deleteTokenById(existingToken.id);
			}

			const newToken = await TokenService.createToken({
				userId: user.id,
				type: "password",
				token,
			});

			if (!newToken) {
				return {
					status: "GENERAL_ERROR",
					message: "Failed to create token",
				};
			}

			return { status: "OK", token };
		} catch (error) {
			console.error("Error generating password reset token:", error);
			return {
				status: "GENERAL_ERROR",
				message:
					error.message ||
					"An error occurred while generating the token",
			};
		}
	},
	verifyResetTokenAndChangePassword: async (token, password) => {
		try {
			jwt.verify(token, JWT_SECRET);
		} catch (error) {
			return {
				status: "INVALID_TOKEN",
				message: "Invalid token or token expired",
			};
		}

		try {
			const decoded = jwt.decode(token);

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

			const existingToken = await TokenService.getTokenByUserIdAndType(
				user.id,
				"password"
			);

			if (existingToken?.token !== token) {
				return {
					status: "INVALID_TOKEN",
					message: "Invalid token",
				};
			}

			const { salt, hash } = AuthService.saltAndHashPassword(password);

			const updatedUser = await UserService.updateUserById(id, {
				password: hash,
				salt,
			});

			if (!updatedUser) {
				return {
					status: "GENERAL_ERROR",
					message: "Failed to update user",
				};
			}

			const isDeleted = await TokenService.deleteTokenById(
				existingToken.id
			);

			if (!isDeleted) {
				return {
					status: "GENERAL_ERROR",
					message: "Failed to update user",
				};
			}

			return {
				status: "OK",
				message: "Password changed successfully",
			};
		} catch (error) {
			console.error("Error verifying email verification token:", error);
			return {
				status: "GENERAL_ERROR",
				message:
					error.message ||
					"An error occurred while verifying the token",
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
