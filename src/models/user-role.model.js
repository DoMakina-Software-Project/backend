import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";

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
			type: DataTypes.ENUM("CLIENT", "SELLER", "STAFF", "SUPERADMIN"),
			primaryKey: true,
			allowNull: false,
		},
	},
	{
		tableName: "user_role",
		underscored: true,
		timestamps: false,
	}
);

export default UserRole;
