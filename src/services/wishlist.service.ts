import { WishlistModel, CarModel } from "../models";
import { InferAttributes } from "sequelize";

export type Wishlist = InferAttributes<WishlistModel>;

type WishlistCreation = Omit<Wishlist, "id" | "createdAt" | "updatedAt">;

const WishlistService = {
	getUserWishlist: async (userId: number): Promise<any[]> => {
		try {
			const wishlistItems = await WishlistModel.findAll({
				where: { userId },
				include: [
					{
						model: CarModel,
					},
				],
				order: [["createdAt", "DESC"]],
			});

			return wishlistItems.map((item) => item.toJSON());
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
