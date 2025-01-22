import crypto from "crypto";
import jwt from "jsonwebtoken";

export default {
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
};
