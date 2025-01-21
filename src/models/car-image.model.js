import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Car from "./car.model.js";

const CarImage = sequelize.define(
	"CarImage",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		url: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		car_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Car,
				key: "id",
			},
			onDelete: "CASCADE",
		},
	},
	{
		tableName: "car_image",
		timestamps: false,
		underscored: true,
	}
);

export default CarImage;
