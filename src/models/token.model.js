import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";

const Token = sequelize.define(
	"Token",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		token: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		type: {
			type: DataTypes.ENUM("password", "email"),
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
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
			onDelete: "CASCADE",
		},
	},
	{
		tableName: "tokens",
		underscored: true,
		timestamps: false,
	}
);

export default Token;
