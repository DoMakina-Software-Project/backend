import { TokenModel } from "../models/index.js";

// Define allowed token types
const TOKEN_TYPES = ["password", "email"];

const TokenService = {
	// Create a new token
	async createToken({ userId, type, token }) {
		try {
			// Validate token type
			if (!TOKEN_TYPES.includes(type)) {
				throw new Error(
					`Invalid token type. Allowed values are ${TOKEN_TYPES.join(
						", "
					)}.`
				);
			}

			const newToken = await TokenModel.create({ userId, type, token });
			return newToken ? newToken.toJSON() : null;
		} catch (error) {
			console.error(`TokenService.createToken() error: ${error}`);
			throw error;
		}
	},

	// Find a token by its ID
	async getTokenById(id) {
		try {
			const token = await TokenModel.findByPk(id);
			return token ? token.toJSON() : null;
		} catch (error) {
			console.error(`TokenService.getTokenById() error: ${error}`);
			throw error;
		}
	},

	async getTokenByUserIdAndType(userId, type) {
		try {
			const token = await TokenModel.findOne({ where: { userId, type } });
			return token ? token.toJSON() : null;
		} catch (error) {
			console.error(
				`TokenService.getTokenByUserIdAndType() error: ${error}`
			);
			throw error;
		}
	},

	// Delete a token by its ID
	async deleteTokenById(id) {
		try {
			const result = await TokenModel.destroy({
				where: { id },
			});

			return result > 0;
		} catch (error) {
			console.error(`TokenService.deleteToken() error: ${error}`);
			throw error;
		}
	},

	// Delete all tokens for a user
	async deleteTokensByUserId(userId) {
		try {
			const result = await TokenModel.destroy({ where: { userId } });
			return result;
		} catch (error) {
			console.error(
				`TokenService.deleteTokensByUserId() error: ${error}`
			);
			throw error;
		}
	},

	async deleteTokenByUserIdAndType(userId, type) {
		try {
			const result = await TokenModel.destroy({
				where: { userId, type },
			});
			return result;
		} catch (error) {
			console.error(
				`TokenService.deleteTokenByUserIdAndType() error: ${error}`
			);
			throw error;
		}
	},

	async getTokenByToken(token) {
		try {
			const newToken = await TokenModel.findOne({ where: { token } });
			return newToken ? newToken.toJSON() : null;
		} catch (error) {
			console.error(`TokenService.getTokenByToken() error: ${error}`);
			throw error;
		}
	},
};

export default TokenService;
