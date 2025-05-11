import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
	"User",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		surname: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		salt: {
			type: DataTypes.STRING(64),
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM("ACTIVE", "INACTIVE", "BANNED", "DELETED"),
			allowNull: false,
			defaultValue: "INACTIVE",
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
		tableName: "user",
		underscored: true,
		timestamps: true,
	}
);

export default User;
