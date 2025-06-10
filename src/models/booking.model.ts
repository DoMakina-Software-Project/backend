import {
	Model,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	ForeignKey,
} from "sequelize";
import sequelize from "../config/db";
import Car from "./car.model";
import User from "./user.model";

class Booking extends Model<
	InferAttributes<Booking>,
	InferCreationAttributes<Booking>
> {
	declare id: CreationOptional<number>;
	declare carId: ForeignKey<Car["id"]>;
	declare clientId: ForeignKey<User["id"]>;
	declare startDate: Date;
	declare endDate: Date;
	declare status:
		| "PENDING"
		| "CONFIRMED"
		| "CANCELLED"
		| "COMPLETED"
		| "REJECTED"
		| "EXPIRED";
	declare paymentStatus: "PENDING" | "PAID" | "REFUNDED" | "FAILED";
	declare paymentMethod: CreationOptional<"CASH">;
	declare totalPrice: number;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Booking.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		carId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Car,
				key: "id",
			},
			onDelete: "CASCADE",
		},
		clientId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
			onDelete: "CASCADE",
		},
		startDate: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		endDate: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM(
				"PENDING",
				"CONFIRMED",
				"CANCELLED",
				"COMPLETED",
				"REJECTED",
				"EXPIRED"
			),
			allowNull: false,
			defaultValue: "PENDING",
		},
		paymentStatus: {
			type: DataTypes.ENUM("PENDING", "PAID", "REFUNDED", "FAILED"),
			allowNull: false,
			defaultValue: "PENDING",
		},
		paymentMethod: {
			type: DataTypes.ENUM("CASH"),
			allowNull: true,
		},
		totalPrice: {
			type: DataTypes.DECIMAL(10, 2),
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
		tableName: "booking",
		underscored: true,
		timestamps: true,
	}
);

export default Booking;
