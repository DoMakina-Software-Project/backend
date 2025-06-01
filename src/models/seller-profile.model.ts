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

class SellerProfile extends Model<
	InferAttributes<SellerProfile>,
	InferCreationAttributes<SellerProfile>
> {
	declare id: CreationOptional<number>;
	declare userId: ForeignKey<User["id"]>;
	declare isBusiness: boolean;
	declare businessName: CreationOptional<string>;
	declare businessAddress: CreationOptional<string>;
	declare country: string;
	declare city: string;
	declare contactPhone: string;
	declare contactEmail: string;
	declare description: CreationOptional<string>;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

SellerProfile.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
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
		isBusiness: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		businessName: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		businessAddress: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		country: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		city: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		contactPhone: {
			type: DataTypes.STRING(20),
			allowNull: false,
		},
		contactEmail: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
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
		tableName: "seller_profile",
		underscored: true,
		timestamps: true,
	}
);

export default SellerProfile;
