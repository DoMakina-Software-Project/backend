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
		icon_url: {
			type: DataTypes.STRING(255),
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
	},
	{
		tableName: "brand",
		underscored: true,
		timestamps: false,
	}
);

export default Brand;
