"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		// Create 'user' table
		await queryInterface.createTable("user", {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			recipe_user_id: {
				type: Sequelize.STRING(255),
				allowNull: false,
				unique: true,
			},
			email: {
				type: Sequelize.STRING(255),
				allowNull: false,
				unique: true,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("NOW"),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("NOW"),
			},
			name: {
				type: Sequelize.STRING(100),
				allowNull: false,
			},
			surname: {
				type: Sequelize.STRING(100),
				allowNull: false,
			},
			password: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			salt: {
				type: Sequelize.STRING(64),
				allowNull: false,
			},
			is_active: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
		});

		// Create 'promotion_price' table
		await queryInterface.createTable("promotion_price", {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			price: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("NOW"),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("NOW"),
			},
		});

		// Create 'brand' table
		await queryInterface.createTable("brand", {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: Sequelize.STRING(100),
				allowNull: false,
				unique: true,
			},
			icon_url: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("NOW"),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("NOW"),
			},
		});

		// Create 'role' table
		await queryInterface.createTable("role", {
			role: {
				type: Sequelize.STRING(20),
				allowNull: false,
				primaryKey: true,
			},
		});

		// Create 'user_role' table
		await queryInterface.createTable("user_role", {
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "user",
					key: "id",
				},
				onDelete: "CASCADE",
			},
			role: {
				type: Sequelize.STRING(20),
				allowNull: false,
				references: {
					model: "role",
					key: "role",
				},
				onDelete: "CASCADE",
			},
		});

		// Create 'tokens' table
		await queryInterface.createTable("tokens", {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			type: {
				type: Sequelize.STRING(50),
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("NOW"),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("NOW"),
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "user",
					key: "id",
				},
				onDelete: "CASCADE",
			},
		});

		// Create 'car' table
		await queryInterface.createTable("car", {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			description: {
				type: Sequelize.STRING(500),
				allowNull: false,
			},
			model: {
				type: Sequelize.STRING(100),
				allowNull: false,
			},
			year: {
				type: Sequelize.STRING(4),
				allowNull: false,
			},
			price: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
			},
			is_sold: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("NOW"),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("NOW"),
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "user",
					key: "id",
				},
				onDelete: "CASCADE",
			},
			brand_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "brand",
					key: "id",
				},
				onDelete: "RESTRICT",
			},
		});

		// Create 'car_image' table
		await queryInterface.createTable("car_image", {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			url: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			car_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "car",
					key: "id",
				},
				onDelete: "CASCADE",
			},
		});

		// Create 'promotion' table
		await queryInterface.createTable("promotion", {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			start_date: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			end_date: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			promotion_price: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("NOW"),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn("NOW"),
			},
			car_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "car",
					key: "id",
				},
				onDelete: "CASCADE",
			},
		});

		// Add necessary indexes
		await queryInterface.addIndex("user", ["email"]);
		await queryInterface.addIndex("user", ["recipe_user_id"]);
		await queryInterface.addIndex("brand", ["name"]);
		await queryInterface.addIndex("car", ["model"]);
		await queryInterface.addIndex("car", ["year"]);
		await queryInterface.addIndex("tokens", ["type"]);
		await queryInterface.addIndex("promotion", ["start_date", "end_date"]);
	},

	down: async (queryInterface, Sequelize) => {
		// Drop all tables in reverse order
		await queryInterface.dropTable("promotion");
		await queryInterface.dropTable("car_image");
		await queryInterface.dropTable("car");
		await queryInterface.dropTable("tokens");
		await queryInterface.dropTable("user_role");
		await queryInterface.dropTable("role");
		await queryInterface.dropTable("brand");
		await queryInterface.dropTable("promotion_price");
		await queryInterface.dropTable("user");
	},
};
