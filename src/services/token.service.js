import { TokenModel } from "../models/index.js";

// Define allowed token types
const TOKEN_TYPES = ["password", "email"];

const TokenService = {
  // Create a new token
  async createToken(userId, type) {
    try {
      // Validate token type
      if (!TOKEN_TYPES.includes(type)) {
        throw new Error(
          `Invalid token type. Allowed values are ${TOKEN_TYPES.join(", ")}.`
        );
      }

      const newToken = await TokenModel.create({ userId, type });
      return newToken ? newToken.toJSON() : null;
    } catch (error) {
      console.error(`TokenService.createToken() error: ${error}`);
      throw new Error("Unable to create token.");
    }
  },

  // Find a token by its ID
  async getTokenById(id) {
    try {
      const token = await TokenModel.findByPk(id);
      return token ? token.toJSON() : null;
    } catch (error) {
      console.error(`TokenService.getTokenById() error: ${error}`);
      throw new Error("Unable to find token by ID.");
    }
  },

  // Find all tokens by a user ID
  async getTokensByUserId(userId) {
    try {
      const tokens = await TokenModel.findAll({ where: { userId } });
      return tokens.map((token) => token.toJSON());
    } catch (error) {
      console.error(`TokenService.getTokensByUserId() error: ${error}`);
      throw new Error("Unable to find tokens for the user.");
    }
  },

  async getTokenByUserIdAndType(userId, type) {
    try {
      const token = await TokenModel.findOne({ where: { userId, type } });
      return token ? token.toJSON() : null;
    } catch (error) {
      console.error(`TokenService.getTokenByUserIdAndType() error: ${error}`);
      throw new Error("Unable to find token by user ID and type.");
    }
  },

  // Update a token type
  async updateTokenType(id, newType) {
    try {
      // Validate new token type
      if (!TOKEN_TYPES.includes(newType)) {
        throw new Error(
          `Invalid token type. Allowed values are ${TOKEN_TYPES.join(", ")}.`
        );
      }

      const token = await TokenModel.findByPk(id);
      if (!token) {
        throw new Error(`Token with ID ${id} not found.`);
      }

      token.type = newType;
      token.updatedAt = new Date();
      await token.save();

      return token.toJSON();
    } catch (error) {
      console.error(`TokenService.updateTokenType() error: ${error}`);
      throw new Error("Unable to update token type.");
    }
  },

  // Delete a token by its ID
  async deleteToken(id) {
    try {
      const result = await TokenModel.destroy({ where: { id } });

      return result > 0;
    } catch (error) {
      console.error(`TokenService.deleteToken() error: ${error}`);
      throw new Error("Unable to delete token.");
    }
  },

  // Delete all tokens for a user
  async deleteTokensByUserId(userId) {
    try {
      const result = await TokenModel.destroy({ where: { userId } });
      return result;
    } catch (error) {
      console.error(`TokenService.deleteTokensByUserId() error: ${error}`);
      throw new Error("Unable to delete tokens for the user.");
    }
  },
};

export default TokenService;
