import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Brand = sequelize.define(
	"Brand",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
		},
		iconUrl: {
			type: DataTypes.STRING(255),
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
		tableName: "brand",
		underscored: true,
		timestamps: true,
	}
);

export default Brand;
