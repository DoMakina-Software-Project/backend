import { PromotionPriceModel } from "../models";
import type { InferAttributes } from "sequelize";

type PromotionPrice = InferAttributes<PromotionPriceModel>;

type CreatePromotionPriceParams = {
	price: number;
};

type UpdatePromotionPriceParams = {
	price: number;
};

const PromotionPriceService = {
	getPromotionPriceByPromotionId: async (
		promotionId: number
	): Promise<PromotionPrice | null> => {
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

	getPromotionPrice: async (): Promise<PromotionPrice | null> => {
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

	createPromotionPrice: async ({
		price,
	}: CreatePromotionPriceParams): Promise<PromotionPrice | null> => {
		try {
			await PromotionPriceModel.destroy({
				truncate: true,
			});

			const promotionPrice = await PromotionPriceModel.create({
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

	updatePromotionPrice: async ({
		price,
	}: UpdatePromotionPriceParams): Promise<PromotionPrice> => {
		try {
			const promotionPrice = await PromotionPriceModel.findOne();
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

	deletePromotionPrice: async (
		promotionId: number
	): Promise<PromotionPrice> => {
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
