import BrandModel from "./brand.model.js";
import CarModel from "./car.model.js";
import CarImageModel from "./car-image.model.js";
import PromotionModel from "./promotion.model.js";
import RoleModel from "./role.model.js";
import UserModel from "./user.model.js";
import UserRoleModel from "./user-role.model.js";
import TokenModel from "./token.model.js";
import PromotionPriceModel from "./promotion-price.model.js";

UserModel.hasMany(UserRoleModel, {
	foreignKey: "userId",
});
UserRoleModel.belongsTo(UserModel, {
	foreignKey: "userId",
});

RoleModel.hasMany(UserRoleModel, { foreignKey: "role" });
UserRoleModel.belongsTo(RoleModel, { foreignKey: "role" });

export {
	BrandModel,
	CarModel,
	CarImageModel,
	PromotionModel,
	RoleModel,
	UserModel,
	UserRoleModel,
	TokenModel,
	PromotionPriceModel,
};
