import UserModel from "./user.model";
import TokenModel from "./token.model";
import UserRoleModel from "./user-role.model";
import SellerProfileModel from "./seller-profile.model";
import BrandModel from "./brand.model";
import CarModel from "./car.model";
import CarImageModel from "./car-image.model";
import RentalAvailabilityModel from "./rental-availability.model";
import BookingModel from "./booking.model";
import WishlistModel from "./wishlist.model";
import ReviewModel from "./review.model";
import PromotionModel from "./promotion.model";
import PromotionPriceModel from "./promotion-price.model";
import SessionModel from "./session.model";

// User associations
UserModel.hasMany(TokenModel, { foreignKey: "userId" });
UserModel.hasMany(UserRoleModel, { foreignKey: "userId" });
UserModel.hasOne(SellerProfileModel, { foreignKey: "userId" });
UserModel.hasMany(CarModel, { foreignKey: "sellerId" });
UserModel.hasMany(BookingModel, { foreignKey: "clientId" });
UserModel.hasMany(WishlistModel, { foreignKey: "userId" });
UserModel.hasMany(ReviewModel, { foreignKey: "userId" });

// Token associations
TokenModel.belongsTo(UserModel, { foreignKey: "userId" });

// UserRole associations
UserRoleModel.belongsTo(UserModel, { foreignKey: "userId" });

// SellerProfile associations
SellerProfileModel.belongsTo(UserModel, { foreignKey: "userId" });

// Brand associations
BrandModel.hasMany(CarModel, { foreignKey: "brandId" });

// Car associations
CarModel.belongsTo(UserModel, { foreignKey: "sellerId" });
CarModel.belongsTo(BrandModel, { foreignKey: "brandId" });
CarModel.hasMany(CarImageModel, { foreignKey: "carId" });
CarModel.hasMany(RentalAvailabilityModel, { foreignKey: "carId" });
CarModel.hasMany(BookingModel, { foreignKey: "carId" });
CarModel.hasMany(WishlistModel, { foreignKey: "carId" });
CarModel.hasMany(ReviewModel, { foreignKey: "carId" });
CarModel.hasMany(PromotionModel, { foreignKey: "carId" });

// CarImage associations
CarImageModel.belongsTo(CarModel, { foreignKey: "carId" });

// RentalAvailability associations
RentalAvailabilityModel.belongsTo(CarModel, { foreignKey: "carId" });

// Booking associations
BookingModel.belongsTo(CarModel, { foreignKey: "carId" });
BookingModel.belongsTo(UserModel, { foreignKey: "clientId" });

// Wishlist associations
WishlistModel.belongsTo(UserModel, { foreignKey: "userId" });
WishlistModel.belongsTo(CarModel, { foreignKey: "carId" });

// Review associations
ReviewModel.belongsTo(UserModel, { foreignKey: "userId" });
ReviewModel.belongsTo(CarModel, { foreignKey: "carId" });

// Promotion associations
PromotionModel.belongsTo(CarModel, { foreignKey: "carId" });

export {
	UserModel,
	TokenModel,
	UserRoleModel,
	SellerProfileModel,
	BrandModel,
	CarModel,
	CarImageModel,
	RentalAvailabilityModel,
	BookingModel,
	WishlistModel,
	ReviewModel,
	PromotionModel,
	PromotionPriceModel,
	SessionModel,
};
