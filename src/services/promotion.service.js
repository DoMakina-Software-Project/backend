import sequelize from "../config/db.js";
import { PromotionModel } from "../models/index.js";
import PromotionPriceService from "./promotion-price.service.js";
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
	createPromotion: async ({ carId, promotionDays }) => {
		try {
			// Get the base promotion price
			const promotionPrice =
				await PromotionPriceService.getPromotionPrice();
			if (!promotionPrice) throw new Error("Promotion price not found");

			const dayPrice = promotionPrice.price;

			// Set start date to the current date
			const startDate = new Date();

			// Calculate end date by adding promotionDays
			const endDate = new Date();
			endDate.setDate(startDate.getDate() + promotionDays); // Adds the given days to the current date

			// Calculate total promotion price
			const totalPrice = promotionDays * dayPrice;

			// Store in the database
			const promotion = await PromotionModel.create({
				carId,
				promotionPrice: totalPrice,
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
			const start = new Date(startDate);
			const end = new Date(endDate);
			const promotionDays = Math.max(
				0,
				(end - start) / (1000 * 60 * 60 * 24)
			);
			const totalPrice = promotionDays * promotionPrice;
			promotion.promotionPrice = promotionPrice;
			promotion.startDate = startDate;
			promotion.endDate = endDate;
			promotion.totalPrice = totalPrice;

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
