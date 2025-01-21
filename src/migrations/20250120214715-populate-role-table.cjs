"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert("role", [
			{
				role: "superadmin",
			},
			{
				role: "admin",
			},
			{
				role: "user",
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {
		queryInterface.bulkDelete("role", null, {});
	},
};
