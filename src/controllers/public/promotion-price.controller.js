import { PromotionPriceService } from "../../services/index.js";

export default {
	getPromotionPrice: async (_, res) => {
		try {
			const promotionPrice =
				await PromotionPriceService.getPromotionPrice();

			if (!promotionPrice) {
				return res
					.status(404)
					.json({ message: "Promotion price not found" });
			}

			return res.status(200).json(promotionPrice.price);
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	},
};
