import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Car from "./car.model.js";

const RentalAvailability = sequelize.define(
	"RentalAvailability",
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
		startDate: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		endDate: {
			type: DataTypes.DATEONLY,
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
		tableName: "rental_availability",
		underscored: true,
		timestamps: true,
	}
);

export default RentalAvailability;
