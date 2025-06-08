import { Request, Response } from "express";
import { WishlistService } from "../../services";
import type { UserWithRoles } from "../../services/user.service";

interface AuthenticatedRequest extends Request {
	user?: UserWithRoles;
}

const WishlistController = {
	async getUserWishlist(req: AuthenticatedRequest, res: Response): Promise<void> {
		try {
			const userId = req.user?.id;
			if (!userId) {
				res.status(401).json({ message: "User not authenticated" });
				return;
			}

			const wishlistItems = await WishlistService.getUserWishlist(userId);
			res.status(200).json(wishlistItems);
		} catch (error: any) {
			console.error(`WishlistController.getUserWishlist error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async addToWishlist(req: AuthenticatedRequest, res: Response): Promise<void> {
		try {
			const userId = req.user?.id;
			if (!userId) {
				res.status(401).json({ message: "User not authenticated" });
				return;
			}

			const { carId } = req.body;
			
			const wishlistItem = await WishlistService.addToWishlist({
				userId,
				carId: Number(carId),
			});

			if (!wishlistItem) {
				res.status(400).json({ message: "Failed to add to wishlist" });
				return;
			}

			res.status(201).json({ message: "Car added to wishlist", data: wishlistItem });
		} catch (error: any) {
			console.error(`WishlistController.addToWishlist error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async removeFromWishlist(req: AuthenticatedRequest, res: Response): Promise<void> {
		try {
			const userId = req.user?.id;
			if (!userId) {
				res.status(401).json({ message: "User not authenticated" });
				return;
			}

			const { carId } = req.params;
			
			const success = await WishlistService.removeFromWishlist(userId, Number(carId));

			if (!success) {
				res.status(404).json({ message: "Wishlist item not found" });
				return;
			}

			res.status(200).json({ message: "Car removed from wishlist" });
		} catch (error: any) {
			console.error(`WishlistController.removeFromWishlist error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async isCarInWishlist(req: AuthenticatedRequest, res: Response): Promise<void> {
		try {
			const userId = req.user?.id;
			if (!userId) {
				res.status(401).json({ message: "User not authenticated" });
				return;
			}

			const { carId } = req.params;
			
			const isInWishlist = await WishlistService.isCarInWishlist(userId, Number(carId));

			res.status(200).json({ isInWishlist });
		} catch (error: any) {
			console.error(`WishlistController.isCarInWishlist error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async clearWishlist(req: AuthenticatedRequest, res: Response): Promise<void> {
		try {
			const userId = req.user?.id;
			if (!userId) {
				res.status(401).json({ message: "User not authenticated" });
				return;
			}

			const success = await WishlistService.clearUserWishlist(userId);

			if (!success) {
				res.status(404).json({ message: "No wishlist items found" });
				return;
			}

			res.status(200).json({ message: "Wishlist cleared successfully" });
		} catch (error: any) {
			console.error(`WishlistController.clearWishlist error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},
};

export default WishlistController; 