"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// Start a transaction
		const transaction = await queryInterface.sequelize.transaction();
		try {
			// Create the user table
			await queryInterface.sequelize.query(
				`CREATE TABLE user (
          id INT NOT NULL AUTO_INCREMENT,
          recipe_user_id VARCHAR(255) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          name VARCHAR(100) NOT NULL,
          surname VARCHAR(100) NOT NULL,
          PRIMARY KEY (id)
        );`,
				{ transaction }
			);

			// Create the promotion_price table
			await queryInterface.sequelize.query(
				`CREATE TABLE promotion_price (
          id INT NOT NULL AUTO_INCREMENT,
          price DECIMAL(10, 2) NOT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        );`,
				{ transaction }
			);

			// Create the brand table
			await queryInterface.sequelize.query(
				`CREATE TABLE brand (
          id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL UNIQUE,
          icon_url VARCHAR(255) NOT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        );`,
				{ transaction }
			);

			// Create the car table
			await queryInterface.sequelize.query(
				`CREATE TABLE car (
          id INT NOT NULL AUTO_INCREMENT,
          description VARCHAR(500) NOT NULL,
          model VARCHAR(100) NOT NULL,
          year YEAR NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          is_sold BOOLEAN NOT NULL DEFAULT FALSE,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          user_id INT NOT NULL,
          brand_id INT NOT NULL,
          PRIMARY KEY (id),
          FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
          FOREIGN KEY (brand_id) REFERENCES brand(id) ON DELETE CASCADE ON UPDATE CASCADE
        );`,
				{ transaction }
			);

			// Create the car_image table
			await queryInterface.sequelize.query(
				`CREATE TABLE car_image (
          id INT NOT NULL AUTO_INCREMENT,
          url VARCHAR(255) NOT NULL,
          car_id INT NOT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          FOREIGN KEY (car_id) REFERENCES car(id) ON DELETE CASCADE ON UPDATE CASCADE
        );`,
				{ transaction }
			);

			// Create the promotion table
			await queryInterface.sequelize.query(
				`CREATE TABLE promotion (
          id INT NOT NULL AUTO_INCREMENT,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          promotion_price DECIMAL(10, 2) NOT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          car_id INT NOT NULL,
          PRIMARY KEY (id),
          FOREIGN KEY (car_id) REFERENCES car(id) ON DELETE CASCADE ON UPDATE CASCADE
        );`,
				{ transaction }
			);

			// Commit the transaction if all queries succeed
			await transaction.commit();
		} catch (error) {
			// Rollback the transaction if any errors were encountered
			await transaction.rollback();
			throw error;
		}
	},

	async down(queryInterface, Sequelize) {
		// Start a transaction
		const transaction = await queryInterface.sequelize.transaction();
		try {
			// Drop the tables in reverse order to satisfy foreign key constraints
			await queryInterface.sequelize.query(
				`DROP TABLE IF EXISTS promotion;`,
				{ transaction }
			);
			await queryInterface.sequelize.query(
				`DROP TABLE IF EXISTS car_image;`,
				{ transaction }
			);
			await queryInterface.sequelize.query(`DROP TABLE IF EXISTS car;`, {
				transaction,
			});
			await queryInterface.sequelize.query(
				`DROP TABLE IF EXISTS brand;`,
				{ transaction }
			);
			await queryInterface.sequelize.query(
				`DROP TABLE IF EXISTS promotion_price;`,
				{ transaction }
			);
			await queryInterface.sequelize.query(`DROP TABLE IF EXISTS user;`, {
				transaction,
			});

			// Commit the transaction
			await transaction.commit();
		} catch (error) {
			// Rollback the transaction if any errors were encountered
			await transaction.rollback();
			throw error;
		}
	},
};
