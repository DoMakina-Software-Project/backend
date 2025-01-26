import { PromotionPriceService } from "../../services/index.js";
export default {
	getPromotionPrice: async (req, res) => {
		try {
			const promotionPrice =
				await PromotionPriceService.getPromotionPriceByPromotionId(1);
			if (!promotionPrice) {
				return res
					.status(404)
					.json({ message: "Promotion price not found" });
			}
			return res.status(200).json(promotionPrice);
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	},
	createPromotionPrice: async (req, res) => {
		try {
			const price = req.body.price;
			const newPromotionPrice =
				await PromotionPriceService.createPromotionPrice({
					promotionId: 1,
					price,
				});
			if (!newPromotionPrice) {
				return res
					.status(400)
					.json({ message: "Failed to create promotion price" });
			}
			return res.status(201).json(newPromotionPrice);
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	},
	updatePromotionPrice: async (req, res) => {
		try {
			const price = req.body.price;
			const newPromotionPrice =
				await PromotionPriceService.updatePromotionPrice({
					promotionId: 1,
					price,
				});
			if (!newPromotionPrice) {
				return res
					.status(404)
					.json({ message: "Promotion price not found" });
			}
			return res.status(200).json(newPromotionPrice);
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	},
	deletePromotionPrice: async (req, res) => {
		try {
			const promotionPrice =
				await PromotionPriceService.deletePromotionPrice(1);
			if (!promotionPrice) {
				return res
					.status(404)
					.json({ message: "Promotion price not found" });
			}
			return res.status(200).json(promotionPrice);
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	},
};
