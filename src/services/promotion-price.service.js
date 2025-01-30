import { PromotionPriceModel } from "../models/index.js";

const PromotionPriceService = {
	getPromotionPriceByPromotionId: async (promotionId) => {
		try {
			const promotionPrice = await PromotionPriceModel.findByPk(
				promotionId
			);
			return promotionPrice ? promotionPrice.toJSON() : null;
		} catch (error) {
			console.log(
				`PromotionPriceService.getPromotionPriceByPromotionId() error: ${error}`
			);
			throw error;
		}
	},
	getPromotionPrice: async () => {
		try {
			const promotionPrice = await PromotionPriceModel.findOne({
				order: [["createdAt", "DESC"]],
			});
			return promotionPrice ? promotionPrice.toJSON() : null;
		} catch (error) {
			console.log(
				`PromotionPriceService.getPromotionPrice() error: ${error}`
			);
			throw error;
		}
	},

	createPromotionPrice: async ({ promotionId, price }) => {
		try {
			const existingPromotionPrice =
				await PromotionPriceService.getPromotionPriceByPromotionId(
					promotionId
				);
			if (existingPromotionPrice)
				throw new Error("Promotion price already exists");

			const promotionPrice = await PromotionPriceModel.create({
				promotionId,
				price,
			});
			return promotionPrice ? promotionPrice.toJSON() : null;
		} catch (error) {
			console.log(
				`PromotionPriceService.createPromotionPrice() error: ${error}`
			);
			throw error;
		}
	},
	updatePromotionPrice: async ({ promotionId, price }) => {
		try {
			const promotionPrice = await PromotionPriceModel.findByPk(
				promotionId
			);
			if (!promotionPrice) throw new Error("Promotion price not found");

			promotionPrice.price = price;
			await promotionPrice.save();
			return promotionPrice.toJSON();
		} catch (error) {
			console.log(
				`PromotionPriceService.updatePromotionPrice() error: ${error}`
			);
			throw error;
		}
	},

	deletePromotionPrice: async (promotionId) => {
		try {
			const promotionPrice = await PromotionPriceModel.findByPk(
				promotionId
			);
			if (!promotionPrice) throw new Error("Promotion price not found");

			await promotionPrice.destroy();
			return promotionPrice.toJSON();
		} catch (error) {
			console.log(
				`PromotionPriceService.deletePromotionPrice() error: ${error}`
			);
			throw error;
		}
	},
};

export default PromotionPriceService;
