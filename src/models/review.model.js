import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";
import Car from "./car.model.js";

const Review = sequelize.define(
	"Review",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
			onDelete: "CASCADE",
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
		rating: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 1,
				max: 5,
			},
		},
		comment: {
			type: DataTypes.TEXT,
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
		tableName: "review",
		underscored: true,
		timestamps: true,
	}
);

export default Review;
