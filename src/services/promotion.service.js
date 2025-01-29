import sequelize from "../config/db.js";
import { PromotionModel } from "../models/index.js";
const PromotionService = {
	getPromotionById: async (promotionId) => {
		try {
			const promotion = await PromotionModel.findByPk(promotionId);
			return promotion ? promotion.toJSON() : null;
		} catch (error) {
			console.log(`PromotionService.getPromotionById() error: ${error}`);
			throw error;
		}
	},
	createPromotion: async ({ carId, promotionPrice, startDate, endDate }) => {
		try {
			const promotion = await PromotionModel.create({
				carId,
				promotionPrice,
				startDate,
				endDate,
			});
			return promotion ? promotion.toJSON() : null;
		} catch (error) {
			console.log(`PromotionService.createPromotion() error: ${error}`);
			throw error;
		}
	},
	updatePromotion: async (
		promotionId,
		{ promotionPrice, startDate, endDate }
	) => {
		try {
			const promotion = await PromotionModel.findByPk(promotionId);
			if (!promotion) throw new Error("Promotion not found");

			promotion.promotionPrice = promotionPrice;
			promotion.startDate = startDate;
			promotion.endDate = endDate;
			await promotion.save();
			return promotion.toJSON();
		} catch (error) {
			console.log(`PromotionService.updatePromotion() error: ${error}`);
			throw error;
		}
	},
	deletePromotion: async (promotionId) => {
		try {
			const promotion = await PromotionModel.findByPk(promotionId);
			if (!promotion) throw new Error("Promotion not found");

			await promotion.destroy();
			return promotion.toJSON();
		} catch (error) {
			console.log(`PromotionService.deletePromotion() error: ${error}`);
			throw error;
		}
	},

	getFiveLatestPromotions: async () => {
		try {
			const promotions = await PromotionModel.findAll({
				limit: 5,
				order: [["createdAt", "DESC"]],
			});
			return promotions.map((promotion) => promotion.toJSON());
		} catch (error) {
			console.log(
				`PromotionService.getFiveLatestPromotions() error: ${error}`
			);
			throw error;
		}
	},

	getRandomPromotions: async (limit = 6) => {
		try {
			const promotions = await PromotionModel.findAll({
				order: sequelize.random(),
				limit,
			});

			return promotions.map((promotion) => promotion.toJSON());
		} catch (error) {
			console.log(
				`PromotionService.getRandomPromotions() error: ${error}`
			);
			throw error;
		}
	},
};
export default PromotionService;
