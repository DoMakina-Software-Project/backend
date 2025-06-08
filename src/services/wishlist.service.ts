import { WishlistModel, CarModel, CarImageModel, BrandModel } from "../models";
import { InferAttributes } from "sequelize";

export type Wishlist = InferAttributes<WishlistModel>;

type CarImage = InferAttributes<CarImageModel>;
type Brand = InferAttributes<BrandModel>;
type Car = InferAttributes<CarModel>;

type CarWithRelations = Car & {
	CarImages?: CarImage[];
	Brand?: Brand;
};

type WishlistWithCar = Wishlist & {
	Car: CarWithRelations;
};

type WishlistCreation = Omit<Wishlist, "id" | "createdAt" | "updatedAt">;

const WishlistService = {
		getUserWishlist: async (userId: number, page: number = 1): Promise<{
		results: any[];
		totalItems: number;
		hasNextPage: boolean;
		totalPages: number;
	}> => {
		try {
			const limit = 10;
			const offset = (page - 1) * limit;

			const { count, rows: wishlistItems } = await WishlistModel.findAndCountAll({
				where: { userId },
				include: [
					{
						model: CarModel,
						include: [
							{ model: CarImageModel },
							{ model: BrandModel }
						],
					},
				],
				order: [["createdAt", "DESC"]],
				limit,
				offset,
			});

			const results = wishlistItems.map((item) => {
				const itemData = item.toJSON() as WishlistWithCar;
				const { CarImages, Brand, ...carRest } = itemData.Car;
				
				return {
					...itemData,
					Car: {
						...carRest,
						images: CarImages?.map((image: CarImage) => image.url) || [],
						brand: Brand?.name || ""
					}
				};
			});

			return {
				results,
				totalItems: count,
				hasNextPage: limit * page < count,
				totalPages: Math.ceil(count / limit),
			};
		} catch (error) {
			console.log(`WishlistService.getUserWishlist() error: ${error}`);
			throw error;
		}
	},

	addToWishlist: async (data: WishlistCreation): Promise<Wishlist | null> => {
		try {
			// Check if item already exists
			const existingItem = await WishlistModel.findOne({
				where: {
					userId: data.userId,
					carId: data.carId,
				},
			});

			if (existingItem) {
				return existingItem.toJSON();
			}

			const wishlistItem = await WishlistModel.create(data);
			return wishlistItem ? wishlistItem.toJSON() : null;
		} catch (error) {
			console.log(`WishlistService.addToWishlist() error: ${error}`);
			throw error;
		}
	},

	removeFromWishlist: async (userId: number, carId: number): Promise<boolean> => {
		try {
			const rowsDeleted = await WishlistModel.destroy({
				where: {
					userId,
					carId,
				},
			});

			return rowsDeleted > 0;
		} catch (error) {
			console.log(`WishlistService.removeFromWishlist() error: ${error}`);
			throw error;
		}
	},

	isCarInWishlist: async (userId: number, carId: number): Promise<boolean> => {
		try {
			const wishlistItem = await WishlistModel.findOne({
				where: {
					userId,
					carId,
				},
			});

			return !!wishlistItem;
		} catch (error) {
			console.log(`WishlistService.isCarInWishlist() error: ${error}`);
			throw error;
		}
	},

	clearUserWishlist: async (userId: number): Promise<boolean> => {
		try {
			const rowsDeleted = await WishlistModel.destroy({
				where: { userId },
			});

			return rowsDeleted > 0;
		} catch (error) {
			console.log(`WishlistService.clearUserWishlist() error: ${error}`);
			throw error;
		}
	},
};

export default WishlistService;
