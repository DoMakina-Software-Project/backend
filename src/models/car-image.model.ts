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

class CarImage extends Model<
	InferAttributes<CarImage>,
	InferCreationAttributes<CarImage>
> {
	declare id: CreationOptional<number>;
	declare url: string;
	declare carId: ForeignKey<Car["id"]>;
}

CarImage.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		url: {
			type: DataTypes.STRING(255),
			allowNull: false,
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
	},
	{
		sequelize,
		tableName: "car_image",
		timestamps: false,
		underscored: true,
	}
);

export default CarImage;
