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
		isSold: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
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
		userId: {
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
	},
	{
		tableName: "car",
		underscored: true,
		timestamps: false,
	}
);

export default Car;
