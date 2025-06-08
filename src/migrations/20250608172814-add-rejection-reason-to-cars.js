"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("car", "rejection_reason", {
			type: Sequelize.TEXT,
			allowNull: true,
			comment:
				"Reason for rejection when verification status is REJECTED",
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn("car", "rejection_reason");
	},
};
