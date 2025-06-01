import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PromotionPrice = sequelize.define(
	"PromotionPrice",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		price: {
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
		tableName: "promotion_price",
		underscored: true,
		timestamps: true,
	}
);

export default PromotionPrice;
