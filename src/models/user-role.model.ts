import {
	Model,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	ForeignKey,
} from "sequelize";
import sequelize from "../config/db";
import User from "./user.model";

class UserRole extends Model<
	InferAttributes<UserRole>,
	InferCreationAttributes<UserRole>
> {
	declare userId: ForeignKey<User["id"]>;
	declare role: "CLIENT" | "SELLER" | "STAFF" | "SUPERADMIN";
}

UserRole.init(
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
		sequelize,
		tableName: "user_role",
		underscored: true,
		timestamps: false,
	}
);

export default UserRole;
