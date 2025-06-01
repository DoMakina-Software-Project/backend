import {
	Model,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
} from "sequelize";
import sequelize from "../config/db";

class Session extends Model<
	InferAttributes<Session>,
	InferCreationAttributes<Session>
> {
	declare sid: string;
	declare expires: Date;
	declare data: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Session.init(
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
		sequelize,
		tableName: "Sessions",
		underscored: true,
		timestamps: true,
	}
);

export default Session;
