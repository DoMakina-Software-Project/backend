import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";
import Role from "./role.model.js";

const UserRole = sequelize.define(
	"UserRole",
	{
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
			onDelete: "CASCADE",
		},
		role: {
			type: DataTypes.STRING(20),
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
