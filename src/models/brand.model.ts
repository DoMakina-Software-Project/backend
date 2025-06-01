import {
	Model,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
} from "sequelize";
import sequelize from "../config/db";

class Brand extends Model<
	InferAttributes<Brand>,
	InferCreationAttributes<Brand>
> {
	declare id: CreationOptional<number>;
	declare name: string;
	declare iconUrl: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Brand.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
		},
		iconUrl: {
			type: DataTypes.STRING(255),
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
		tableName: "brand",
		underscored: true,
		timestamps: true,
	}
);

export default Brand;
