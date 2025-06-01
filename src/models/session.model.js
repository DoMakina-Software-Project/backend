import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Session = sequelize.define(
	"Session",
	{
		sid: {
			type: DataTypes.STRING(36),
			primaryKey: true,
		},
		expires: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		data: {
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
		tableName: "Sessions",
		underscored: true,
		timestamps: true,
	}
);

export default Session;
