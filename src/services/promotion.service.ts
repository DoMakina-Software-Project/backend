import sequelize from "../config/db";
import { PromotionModel } from "../models";
import PromotionPriceService from "./promotion-price.service";
import { Op, InferAttributes } from "sequelize";

type Promotion = InferAttributes<PromotionModel>;

type CreatePromotionParams = {
	carId: number;
	promotionDays: number;
};

type UpdatePromotionParams = {
	promotionPrice: number;
	startDate: Date | string;
	endDate: Date | string;
};

const PromotionService = {
	getPromotionById: async (
		promotionId: number
	): Promise<Promotion | null> => {
		try {
			const promotion = await PromotionModel.findByPk(promotionId);
			return promotion ? promotion.toJSON() : null;
		} catch (error) {
			console.log(`PromotionService.getPromotionById() error: ${error}`);
			throw error;
		}
	},

	createPromotion: async ({
		carId,
		promotionDays,
	}: CreatePromotionParams): Promise<Promotion | null> => {
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
			endDate.setDate(startDate.getDate() + promotionDays);

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
		promotionId: number,
		{ promotionPrice, startDate, endDate }: UpdatePromotionParams
	): Promise<Promotion> => {
		try {
			const promotion = await PromotionModel.findByPk(promotionId);
			if (!promotion) throw new Error("Promotion not found");

			const start = new Date(startDate);
			const end = new Date(endDate);
			const promotionDays = Math.max(
				0,
				(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
			);
			const totalPrice = promotionDays * promotionPrice;

			await promotion.update({
				promotionPrice: totalPrice,
				startDate: start,
				endDate: end,
			});

			return promotion.toJSON();
		} catch (error) {
			console.log(`PromotionService.updatePromotion() error: ${error}`);
			throw error;
		}
	},

	deletePromotion: async (promotionId: number): Promise<Promotion> => {
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

	getFiveLatestPromotions: async (): Promise<Promotion[]> => {
		try {
			const promotions = await PromotionModel.findAll({
				where: {
					endDate: {
						[Op.gte]: new Date(),
					},
				},
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

	getRandomPromotions: async (limit = 6): Promise<Promotion[]> => {
		try {
			const promotions = await PromotionModel.findAll({
				where: {
					endDate: {
						[Op.gte]: new Date(),
					},
				},
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

	getTotalRevenue: async (): Promise<number> => {
		try {
			const promotions = await PromotionModel.findAll();
			const totalRevenue = promotions.reduce(
				(sum, promo) =>
					sum + parseFloat(promo.promotionPrice.toString()),
				0
			);
			return totalRevenue;
		} catch (error) {
			console.log(`PromotionService.getTotalRevenue() error: ${error}`);
			throw error;
		}
	},

	getYearlyRevenue: async (): Promise<number> => {
		try {
			const startOfYear = new Date();
			startOfYear.setMonth(0, 1);
			startOfYear.setHours(0, 0, 0, 0);

			const promotions = await PromotionModel.findAll({
				where: {
					startDate: { [Op.gte]: startOfYear },
				},
			});

			const yearlyRevenue = promotions.reduce(
				(sum, promo) =>
					sum + parseFloat(promo.promotionPrice.toString()),
				0
			);
			return yearlyRevenue;
		} catch (error) {
			console.log(`PromotionService.getYearlyRevenue() error: ${error}`);
			throw error;
		}
	},

	getMonthlyRevenue: async (): Promise<number> => {
		try {
			const startOfMonth = new Date();
			startOfMonth.setDate(1);
			startOfMonth.setHours(0, 0, 0, 0);

			const promotions = await PromotionModel.findAll({
				where: {
					startDate: { [Op.gte]: startOfMonth },
				},
			});

			const monthlyRevenue = promotions.reduce(
				(sum, promo) =>
					sum + parseFloat(promo.promotionPrice.toString()),
				0
			);
			return monthlyRevenue;
		} catch (error) {
			console.log(`PromotionService.getMonthlyRevenue() error: ${error}`);
			throw error;
		}
	},

	getWeeklyRevenue: async (): Promise<number> => {
		try {
			const startOfWeek = new Date();
			const dayOfWeek = startOfWeek.getDay();
			startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
			startOfWeek.setHours(0, 0, 0, 0);

			const promotions = await PromotionModel.findAll({
				where: {
					startDate: { [Op.gte]: startOfWeek },
				},
			});

			const weeklyRevenue = promotions.reduce(
				(sum, promo) =>
					sum + parseFloat(promo.promotionPrice.toString()),
				0
			);
			return weeklyRevenue;
		} catch (error) {
			console.log(`PromotionService.getWeeklyRevenue() error: ${error}`);
			throw error;
		}
	},

	getDailyRevenue: async (): Promise<number> => {
		try {
			const startOfDay = new Date();
			startOfDay.setHours(0, 0, 0, 0);

			const promotions = await PromotionModel.findAll({
				where: {
					startDate: { [Op.gte]: startOfDay },
				},
			});

			const dailyRevenue = promotions.reduce(
				(sum, promo) =>
					sum + parseFloat(promo.promotionPrice.toString()),
				0
			);
			return dailyRevenue;
		} catch (error) {
			console.log(`PromotionService.getDailyRevenue() error: ${error}`);
			throw error;
		}
	},
};

export default PromotionService;
