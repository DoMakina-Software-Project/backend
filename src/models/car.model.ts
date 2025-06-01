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
import Brand from "./brand.model";

class Car extends Model<InferAttributes<Car>, InferCreationAttributes<Car>> {
	declare id: CreationOptional<number>;
	declare sellerId: ForeignKey<User["id"]>;
	declare brandId: ForeignKey<Brand["id"]>;
	declare model: string;
	declare year: string;
	declare price: number;
	declare description: string;
	declare mileage: CreationOptional<number>;
	declare fuelType: "PETROL" | "DIESEL" | "ELECTRIC" | "HYBRID" | "OTHER";
	declare transmission: "MANUAL" | "AUTOMATIC" | "SEMI_AUTOMATIC";
	declare listingType: "SALE" | "RENT";
	declare status: "SOLD" | "HIDDEN" | "ACTIVE";
	declare verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Car.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		sellerId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
			onDelete: "CASCADE",
		},
		brandId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Brand,
				key: "id",
			},
			onDelete: "RESTRICT",
		},
		model: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		year: {
			type: DataTypes.STRING(4),
			allowNull: false,
		},
		price: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING(500),
			allowNull: false,
		},
		mileage: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		fuelType: {
			type: DataTypes.ENUM(
				"PETROL",
				"DIESEL",
				"ELECTRIC",
				"HYBRID",
				"OTHER"
			),
			allowNull: false,
		},
		transmission: {
			type: DataTypes.ENUM("MANUAL", "AUTOMATIC", "SEMI_AUTOMATIC"),
			allowNull: false,
		},
		listingType: {
			type: DataTypes.ENUM("SALE", "RENT"),
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM("SOLD", "HIDDEN", "ACTIVE"),
			allowNull: false,
			defaultValue: "ACTIVE",
		},
		verificationStatus: {
			type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
			allowNull: false,
			defaultValue: "PENDING",
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
		tableName: "car",
		underscored: true,
		timestamps: true,
	}
);

export default Car;
