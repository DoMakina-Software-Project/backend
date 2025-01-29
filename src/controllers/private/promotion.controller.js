import { PromotionService } from "../../services/index.js";
export default {
	getPromotion: async (req, res) => {
		try {
			const promotionId = req.params.id;
			const promotion = await PromotionService.getPromotionById(
				promotionId
			);
			if (!promotion) {
				return res.status(404).json({ message: "Promotion not found" });
			}
			return res.status(200).json(promotion);
		} catch (error) {
			console.log(`getPromotionById() error: ${error}`);
			return res.status(500).json({ message: error.message });
		}
	},
	createPromotion: async (req, res) => {
		try {
			const { promotionPrice, startDate, endDate } = req.body;
			const promotion = await PromotionService.createPromotion({
				carId,
				startDate,
				endDate,
				promotionPrice,
			});
			if (!promotion)
				return res
					.status(400)
					.json({ message: "Failed to create promotion" });

			return res.status(201).json(promotion);
		} catch (error) {
			console.log(`createPromotion() error: ${error}`);
			return res.status(500).json({ message: "Internal server error" });
		}
	},
	updatePromotion: async (req, res) => {
		try {
			const promotionId = req.params.id;
			const { carId, promotionPrice, startDate, endDate } = req.body;
			const promotion = await PromotionService.updatePromotion(
				promotionId,
				{
					promotionPrice,
					startDate,
					endDate,
				}
			);
			if (!promotion)
				return res
					.status(404)
					.json({ message: "Failed to update promotion" });

			return res.status(200).json(promotion);
		} catch (error) {
			console.log(`updatePromotion() error: ${error}`);
			return res.status(500).json({ message: error.message });
		}
	},
	deletePromotion: async (req, res) => {
		try {
			const promotionId = req.params.id;
			const promotion = await PromotionService.deletePromotion(
				promotionId
			);
			if (!promotion)
				return res
					.status(404)
					.json({ message: "Failed to delete promotion" });

			return res.status(200).json(promotion);
		} catch (error) {
			console.log(`deletePromotion() error: ${error}`);
			return res.status(500).json({ message: error.message });
		}
	},
};
