import { Request, Response } from "express";
import { PromotionService } from "../../services";
import type { UserWithRoles } from "../../services/user.service";

interface SellerRequest extends Request {
	user: UserWithRoles;
}

const SellerPromotionController = {
	async getPromotion(req: Request, res: Response): Promise<void> {
		try {
			const promotionId = req.params.id;
			const promotion = await PromotionService.getPromotionById(
				Number(promotionId)
			);
			if (!promotion) {
				res.status(404).json({ message: "Promotion not found" });
				return;
			}
			res.status(200).json(promotion);
		} catch (error: any) {
			console.log(`getPromotionById() error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async createPromotion(req: SellerRequest, res: Response): Promise<void> {
		try {
			const { carId, promotionDays } = req.body;
			const promotion = await PromotionService.createPromotion({
				carId,
				promotionDays,
			});
			if (!promotion) {
				res.status(400).json({ message: "Failed to create promotion" });
				return;
			}
			res.status(201).json(promotion);
		} catch (error: any) {
			console.log(`createPromotion() error: ${error}`);
			res.status(500).json({ message: "Internal server error" });
		}
	},

	async updatePromotion(req: Request, res: Response): Promise<void> {
		try {
			const promotionId = req.params.id;
			const { carId, promotionPrice, startDate, endDate } = req.body;
			const promotion = await PromotionService.updatePromotion(
				Number(promotionId),
				{
					promotionPrice,
					startDate,
					endDate,
				}
			);
			if (!promotion) {
				res.status(404).json({ message: "Failed to update promotion" });
				return;
			}
			res.status(200).json(promotion);
		} catch (error: any) {
			console.log(`updatePromotion() error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},

	async deletePromotion(req: Request, res: Response): Promise<void> {
		try {
			const promotionId = req.params.id;
			const promotion = await PromotionService.deletePromotion(
				Number(promotionId)
			);
			if (!promotion) {
				res.status(404).json({ message: "Failed to delete promotion" });
				return;
			}
			res.status(200).json(promotion);
		} catch (error: any) {
			console.log(`deletePromotion() error: ${error}`);
			res.status(500).json({ message: error.message });
		}
	},
};

export default SellerPromotionController;
