import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Role = sequelize.define(
	"Role",
	{
		role: {
			type: DataTypes.STRING(20),
			allowNull: false,
			primaryKey: true,
		},
	},
	{
		tableName: "role",
		underscored: true,
		timestamps: false,
	}
);

export default Role;
