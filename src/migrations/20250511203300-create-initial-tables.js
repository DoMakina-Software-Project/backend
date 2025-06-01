"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: async (queryInterface, Sequelize) => {
		// Create user table
		await queryInterface.createTable("user", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING(255),
				allowNull: false,
				unique: true,
			},
			password: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			salt: {
				type: Sequelize.STRING(64),
				allowNull: false,
			},
			name: {
				type: Sequelize.STRING(100),
				allowNull: false,
			},
			surname: {
				type: Sequelize.STRING(100),
				allowNull: false,
			},
			status: {
				// ACTIVE: User has verified email and can use all features
				// INACTIVE: User hasn't verified email yet or temporarily deactivated account
				// BANNED: User violated terms and is permanently banned from platform
				// DELETED: User requested account deletion but data retained for legal purposes
				type: Sequelize.ENUM("ACTIVE", "INACTIVE", "BANNED", "DELETED"),
				allowNull: false,
				defaultValue: "INACTIVE",
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
		});

		// Add index for email search
		await queryInterface.addIndex("user", ["email"], {
			name: "user_email_idx",
		});

		// Create tokens table
		await queryInterface.createTable("tokens", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
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
			token: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			type: {
				type: Sequelize.ENUM("PASSWORD", "EMAIL"),
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
		});

		// Add unique constraint for user_id and type combination
		await queryInterface.addConstraint("tokens", {
			fields: ["user_id", "type"],
			type: "unique",
			name: "unique_user_type",
		});

		// Add index for token lookups
		await queryInterface.addIndex("tokens", ["token"], {
			name: "tokens_token_idx",
		});

		// Create user_role table
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
				type: Sequelize.ENUM("CLIENT", "SELLER", "STAFF", "SUPERADMIN"),
				allowNull: false,
			},
		});

		// Add primary key to user_role
		await queryInterface.addConstraint("user_role", {
			fields: ["user_id", "role"],
			type: "primary key",
			name: "user_role_pk",
		});

		// Create seller_profile table
		await queryInterface.createTable("seller_profile", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
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
			is_business: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			business_name: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			business_address: {
				type: Sequelize.STRING(255),
				allowNull: true,
			},
			country: {
				type: Sequelize.STRING(100),
				allowNull: false,
			},
			city: {
				type: Sequelize.STRING(100),
				allowNull: false,
			},
			contact_phone: {
				type: Sequelize.STRING(20),
				allowNull: false,
			},
			contact_email: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
		});

		// Add unique constraint for user_id
		await queryInterface.addConstraint("seller_profile", {
			fields: ["user_id"],
			type: "unique",
			name: "unique_seller_profile",
		});

		// Add index for business name search
		await queryInterface.addIndex("seller_profile", ["business_name"], {
			name: "seller_profile_business_name_idx",
		});

		// Add index for location-based queries
		await queryInterface.addIndex("seller_profile", ["country", "city"], {
			name: "seller_profile_location_idx",
		});

		// Create brand table
		await queryInterface.createTable("brand", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
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
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
		});

		// Create car table
		await queryInterface.createTable("car", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			seller_id: {
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
			description: {
				type: Sequelize.STRING(500),
				allowNull: false,
			},
			mileage: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			fuel_type: {
				type: Sequelize.ENUM(
					"PETROL",
					"DIESEL",
					"ELECTRIC",
					"HYBRID",
					"OTHER"
				),
				allowNull: false,
			},
			transmission: {
				type: Sequelize.ENUM("MANUAL", "AUTOMATIC", "SEMI_AUTOMATIC"),
				allowNull: false,
			},
			listing_type: {
				type: Sequelize.ENUM("SALE", "RENT"),
				allowNull: false,
			},
			status: {
				type: Sequelize.ENUM("SOLD", "HIDDEN", "ACTIVE"),
				allowNull: false,
				defaultValue: "ACTIVE",
			},
			verification_status: {
				type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED"),
				allowNull: false,
				defaultValue: "PENDING",
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
		});

		// Add indexes for common car queries
		await queryInterface.addIndex("car", ["seller_id"], {
			name: "car_seller_idx",
		});
		await queryInterface.addIndex("car", ["brand_id"], {
			name: "car_brand_idx",
		});
		await queryInterface.addIndex(
			"car",
			["status", "verification_status"],
			{
				name: "car_status_idx",
			}
		);
		await queryInterface.addIndex("car", ["listing_type", "price"], {
			name: "car_listing_price_idx",
		});

		// Create car_image table
		await queryInterface.createTable("car_image", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
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
			url: {
				type: Sequelize.STRING(255),
				allowNull: false,
			},
		});

		// Add index for car images
		await queryInterface.addIndex("car_image", ["car_id"], {
			name: "car_image_car_idx",
		});

		// Create rental_availability table
		await queryInterface.createTable("rental_availability", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
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
			start_date: {
				type: Sequelize.DATEONLY,
				allowNull: false,
			},
			end_date: {
				type: Sequelize.DATEONLY,
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
		});

		// Add index for rental availability queries
		await queryInterface.addIndex(
			"rental_availability",
			["car_id", "start_date", "end_date"],
			{
				name: "rental_availability_dates_idx",
			}
		);

		// Add check constraint for date validity
		await queryInterface.addConstraint("rental_availability", {
			fields: ["start_date", "end_date"],
			type: "check",
			name: "check_dates_valid",
			where: {
				start_date: {
					[Sequelize.Op.lte]: Sequelize.col("end_date"),
				},
			},
		});

		// Create booking table
		await queryInterface.createTable("booking", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
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
			client_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "user",
					key: "id",
				},
				onDelete: "CASCADE",
			},
			start_date: {
				type: Sequelize.DATEONLY,
				allowNull: false,
			},
			end_date: {
				type: Sequelize.DATEONLY,
				allowNull: false,
			},
			status: {
				type: Sequelize.ENUM(
					"PENDING",
					"CONFIRMED",
					"CANCELLED",
					"COMPLETED",
					"REJECTED",
					"EXPIRED"
				),
				allowNull: false,
				defaultValue: "PENDING",
			},
			payment_status: {
				type: Sequelize.ENUM("PENDING", "PAID", "REFUNDED", "FAILED"),
				allowNull: false,
				defaultValue: "PENDING",
			},
			payment_method: {
				type: Sequelize.ENUM("PAYPAL", "CASH"),
				allowNull: true,
			},
			total_price: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
		});

		// Add indexes for booking queries
		await queryInterface.addIndex("booking", ["car_id", "status"], {
			name: "booking_car_status_idx",
		});
		await queryInterface.addIndex("booking", ["client_id", "status"], {
			name: "booking_client_status_idx",
		});
		await queryInterface.addIndex("booking", ["start_date", "end_date"], {
			name: "booking_dates_idx",
		});
		await queryInterface.addIndex("booking", ["payment_status"], {
			name: "booking_payment_status_idx",
		});

		// Add check constraint for booking dates
		await queryInterface.addConstraint("booking", {
			fields: ["start_date", "end_date"],
			type: "check",
			name: "check_booking_dates_valid",
			where: {
				start_date: {
					[Sequelize.Op.lte]: Sequelize.col("end_date"),
				},
			},
		});

		// Create wishlist table
		await queryInterface.createTable("wishlist", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
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
			car_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "car",
					key: "id",
				},
				onDelete: "CASCADE",
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
		});

		// Add unique constraint for wishlist entries
		await queryInterface.addConstraint("wishlist", {
			fields: ["user_id", "car_id"],
			type: "unique",
			name: "unique_wishlist_entry",
		});

		// Add index for wishlist queries
		await queryInterface.addIndex("wishlist", ["user_id"], {
			name: "wishlist_user_idx",
		});

		// Create review table
		await queryInterface.createTable("review", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
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
			car_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "car",
					key: "id",
				},
				onDelete: "CASCADE",
			},
			rating: {
				type: Sequelize.INTEGER,
				allowNull: false,
				validate: {
					min: 1,
					max: 5,
				},
			},
			comment: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
		});

		// Add unique constraint for reviews (one review per user per car)
		await queryInterface.addConstraint("review", {
			fields: ["user_id", "car_id"],
			type: "unique",
			name: "unique_review",
		});

		// Add indexes for review queries
		await queryInterface.addIndex("review", ["car_id"], {
			name: "review_car_idx",
		});
		await queryInterface.addIndex("review", ["car_id", "rating"], {
			name: "review_car_rating_idx",
		});

		// Create promotion table
		await queryInterface.createTable("promotion", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
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
			start_date: {
				type: Sequelize.DATEONLY,
				allowNull: false,
			},
			end_date: {
				type: Sequelize.DATEONLY,
				allowNull: false,
			},
			promotion_price: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
		});

		// Add indexes for promotion queries
		await queryInterface.addIndex(
			"promotion",
			["car_id", "start_date", "end_date"],
			{
				name: "promotion_dates_idx",
			}
		);

		// Add check constraint for promotion dates
		await queryInterface.addConstraint("promotion", {
			fields: ["start_date", "end_date"],
			type: "check",
			name: "check_promotion_dates_valid",
			where: {
				start_date: {
					[Sequelize.Op.lte]: Sequelize.col("end_date"),
				},
			},
		});

		// Create promotion_price table
		await queryInterface.createTable("promotion_price", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			price: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
		});

		// Create Sessions table with optimized structure
		await queryInterface.createTable("Sessions", {
			sid: {
				type: Sequelize.STRING(36),
				primaryKey: true,
			},
			expires: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			data: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
		});

		// Add index for session expiration cleanup
		await queryInterface.addIndex("Sessions", ["expires"], {
			name: "sessions_expires_idx",
		});
	},

	down: async (queryInterface, Sequelize) => {
		// Drop tables in reverse order to handle foreign key constraints
		await queryInterface.dropTable("Sessions");
		await queryInterface.dropTable("promotion_price");
		await queryInterface.dropTable("promotion");
		await queryInterface.dropTable("review");
		await queryInterface.dropTable("wishlist");
		await queryInterface.dropTable("booking");
		await queryInterface.dropTable("rental_availability");
		await queryInterface.dropTable("car_image");
		await queryInterface.dropTable("car");
		await queryInterface.dropTable("brand");
		await queryInterface.dropTable("seller_profile");
		await queryInterface.dropTable("user_role");
		await queryInterface.dropTable("tokens");
		await queryInterface.dropTable("user");
	},
};
