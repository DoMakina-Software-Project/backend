import { Request, Response } from "express";
import { PromotionPriceService } from "../../services";
import type { UserWithRoles } from "../../services/user.service";

interface StaffRequest extends Request {
	user: UserWithRoles;
}

const StaffPromotionPriceController = {
	async getPromotionPrice(req: StaffRequest, res: Response): Promise<void> {
		try {
			const promotionPrice =
				await PromotionPriceService.getPromotionPrice();
			if (!promotionPrice) {
				res.status(404).json({ message: "Promotion price not found" });
				return;
			}
			res.status(200).json(promotionPrice);
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	},

	async createPromotionPrice(req: StaffRequest, res: Response) {
		try {
			const price = req.body.price;
			const newPromotionPrice =
				await PromotionPriceService.createPromotionPrice({
					price,
				});
			if (!newPromotionPrice) {
				res.status(400).json({
					message: "Failed to create promotion price",
				});
				return;
			}
			res.status(201).json(newPromotionPrice);
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	},

	async updatePromotionPrice(
		req: StaffRequest,
		res: Response
	): Promise<void> {
		try {
			const price = req.body.price;
			const newPromotionPrice =
				await PromotionPriceService.updatePromotionPrice({
					price,
				});
			if (!newPromotionPrice) {
				res.status(404).json({ message: "Promotion price not found" });
				return;
			}
			res.status(200).json({
				message: "Promotion price updated",
			});
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	},

	async deletePromotionPrice(req: Request, res: Response): Promise<void> {
		try {
			const id = req.params.id;
			const promotionPrice =
				await PromotionPriceService.deletePromotionPrice(Number(id));
			if (!promotionPrice) {
				res.status(404).json({ message: "Promotion price not found" });
				return;
			}
			res.status(200).json({ message: "Promotion price deleted" });
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	},
};

export default StaffPromotionPriceController;
