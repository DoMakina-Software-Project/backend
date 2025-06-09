"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("review", "booking_id", {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: "booking",
				key: "id",
			},
			onDelete: "CASCADE",
		});

		// Add unique constraint to prevent multiple reviews for same booking
		await queryInterface.addConstraint("review", {
			fields: ["booking_id"],
			type: "unique",
			name: "unique_booking_review",
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeConstraint(
			"review",
			"unique_booking_review"
		);
		await queryInterface.removeColumn("review", "booking_id");
	},
};
