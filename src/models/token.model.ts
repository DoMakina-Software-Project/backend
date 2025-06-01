import {
	Model,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	ForeignKey,
} from "sequelize";
import sequelize from "../config/db";
import User from "./user.model";

class Token extends Model<
	InferAttributes<Token>,
	InferCreationAttributes<Token>
> {
	declare id: CreationOptional<number>;
	declare token: string;
	declare type: "PASSWORD" | "EMAIL";
	declare userId: ForeignKey<User["id"]>;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Token.init(
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
			type: DataTypes.ENUM("PASSWORD", "EMAIL"),
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
		sequelize,
		tableName: "tokens",
		underscored: true,
		timestamps: true,
	}
);

export default Token;
