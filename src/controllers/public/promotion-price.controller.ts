import { Request, Response } from "express";
import { PromotionPriceService } from "../../services";

const PromotionPriceController = {
	getPromotionPrice: async (_: Request, res: Response): Promise<void> => {
		try {
			const promotionPrice =
				await PromotionPriceService.getPromotionPrice();

			if (!promotionPrice) {
				res.status(404).json({ message: "Promotion price not found" });
				return;
			}

			res.status(200).json(promotionPrice.price);
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	},
};

export default PromotionPriceController;
