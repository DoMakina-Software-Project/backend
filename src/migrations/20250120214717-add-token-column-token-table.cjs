"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn("tokens", "token", {
			type: Sequelize.STRING(255),
			allowNull: false,
		});

		// Add unique constraint to (userId, tokenType)
		await queryInterface.addConstraint("tokens", {
			fields: ["user_id", "type"],
			type: "unique",
			name: "unique_user_type",
		});

		// Add index to token column
		await queryInterface.addIndex("tokens", ["token"], {
			name: "idx_token",
		});
	},

	down: async (queryInterface, Sequelize) => {
		// Remove index on token
		await queryInterface.removeIndex("tokens", "idx_token");

		// Remove unique constraint
		await queryInterface.removeConstraint("tokens", "unique_user_type");

		// Remove token column
		await queryInterface.removeColumn("tokens", "token");
	},
};
