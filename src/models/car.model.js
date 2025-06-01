import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";
import Brand from "./brand.model.js";

const Car = sequelize.define(
	"Car",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		sellerId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
			onDelete: "CASCADE",
		},
		brandId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Brand,
				key: "id",
			},
			onDelete: "RESTRICT",
		},
		model: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		year: {
			type: DataTypes.STRING(4),
			allowNull: false,
		},
		price: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING(500),
			allowNull: false,
		},
		mileage: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		fuelType: {
			type: DataTypes.ENUM(
				"PETROL",
				"DIESEL",
				"ELECTRIC",
				"HYBRID",
				"OTHER"
			),
			allowNull: false,
		},
		transmission: {
			type: DataTypes.ENUM("MANUAL", "AUTOMATIC", "SEMI_AUTOMATIC"),
			allowNull: false,
		},
		listingType: {
			type: DataTypes.ENUM("SALE", "RENT"),
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM("SOLD", "HIDDEN", "ACTIVE"),
			allowNull: false,
			defaultValue: "ACTIVE",
		},
		verificationStatus: {
			type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
			allowNull: false,
			defaultValue: "PENDING",
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		tableName: "car",
		underscored: true,
		timestamps: true,
	}
);

export default Car;
