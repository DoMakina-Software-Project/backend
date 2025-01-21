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
		description: {
			type: DataTypes.STRING(500),
			allowNull: false,
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
		is_sold: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
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
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
			onDelete: "CASCADE",
		},
		brand_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Brand,
				key: "id",
			},
			onDelete: "RESTRICT",
		},
	},
	{
		tableName: "car",
		underscored: true,
		timestamps: false,
	}
);

export default Car;
