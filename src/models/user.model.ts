import {
	Model,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
} from "sequelize";
import sequelize from "../config/db";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: CreationOptional<number>;
	declare email: string;
	declare name: string;
	declare surname: string;
	declare password: string;
	declare salt: string;
	declare status: "ACTIVE" | "INACTIVE" | "BANNED" | "DELETED";
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

User.init(
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
		sequelize,
		tableName: "user",
		underscored: true,
		timestamps: true,
	}
);

export default User;
