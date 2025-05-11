import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Car from "./car.model.js";
import User from "./user.model.js";

const Booking = sequelize.define(
	"Booking",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		carId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Car,
				key: "id",
			},
			onDelete: "CASCADE",
		},
		clientId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
			onDelete: "CASCADE",
		},
		startDate: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		endDate: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM(
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
		paymentStatus: {
			type: DataTypes.ENUM("PENDING", "PAID", "REFUNDED", "FAILED"),
			allowNull: false,
			defaultValue: "PENDING",
		},
		paymentMethod: {
			type: DataTypes.ENUM("PAYPAL", "CASH"),
			allowNull: true,
		},
		totalPrice: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
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
		tableName: "booking",
		underscored: true,
		timestamps: true,
	}
);

export default Booking;
