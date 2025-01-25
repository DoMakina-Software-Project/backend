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
  createPromotion: async ({
    brandId,
    name,
    description,
    startDate,
    endDate,
  }) => {
    try {
      const existingPromotion = await PromotionService.getPromotionById(
        promotionId
      );
      if (existingPromotion) throw new Error("Promotion already exists");

      const promotion = await PromotionModel.create({
        brandId,
        name,
        description,
        startDate,
        endDate,
      });
      return promotion ? promotion.toJSON() : null;
    } catch (error) {
      console.log(`PromotionService.createPromotion() error: ${error}`);
      throw error;
    }
  },
  updatePromotion: async ({
    promotionId,
    brandId,
    name,
    description,
    startDate,
    endDate,
  }) => {
    try {
      const promotion = await PromotionModel.findByPk(promotionId);
      if (!promotion) throw new Error("Promotion not found");

      promotion.brandId = brandId;
      promotion.name = name;
      promotion.description = description;
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
};
export default PromotionService;
