import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";
import Role from "./role.model.js";

const UserRole = sequelize.define(
	"UserRole",
	{
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			references: {
				model: User,
				key: "id",
			},
			onDelete: "CASCADE",
		},
		role: {
			type: DataTypes.STRING(20),
			primaryKey: true,
			allowNull: false,
			references: {
				model: Role,
				key: "role",
			},
			onDelete: "CASCADE",
		},
	},
	{
		tableName: "user_role",
		underscored: true,
		timestamps: false,
	}
);

export default UserRole;
