import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Car from "./car.model.js";

const Promotion = sequelize.define(
	"Promotion",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		start_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		end_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		promotion_price: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
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
		tableName: "promotion",
		underscored: true,
		timestamps: false,
	}
);

export default Promotion;
