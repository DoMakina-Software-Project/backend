import { PromotionService } from "../../services/index.js";
export default {
  getPromotionById: async (req, res) => {
    try {
      const { promotionId } = req.params;
      const promotion = await PromotionService.getPromotionById(promotionId);

      return res.status(200).json(promotion);
    } catch (error) {
      console.log(`getPromotionById() error: ${error}`);
      return res.status(500).json({ message: error.message });
    }
  },
  createPromotion: async (req, res) => {
    try {
      const { brandId } = req.params;
      const { name, description, startDate, endDate } = req.body;
      const promotion = await PromotionService.createPromotion({
        brandId,
        name,
        description,
        startDate,
        endDate,
      });
      if (!promotion)
        return res.status(400).json({ message: "Failed to create promotion" });

      return res.status(201).json(promotion);
    } catch (error) {
      console.log(`createPromotion() error: ${error}`);
      return res.status(500).json({ message: error.message });
    }
  },
  updatePromotion: async (req, res) => {
    try {
      const { promotionId } = req.params;
      const { brandId } = req.params;
      const { name, description, startDate, endDate } = req.body;
      const promotion = await PromotionService.updatePromotion({
        promotionId,
        brandId,
        name,
        description,
        startDate,
        endDate,
      });
      if (!promotion)
        return res.status(404).json({ message: "Failed to update promotion" });

      return res.status(200).json(promotion);
    } catch (error) {
      console.log(`updatePromotion() error: ${error}`);
      return res.status(500).json({ message: error.message });
    }
  },
  deletePromotion: async (req, res) => {
    try {
      const { promotionId } = req.params;
      const promotion = await PromotionService.deletePromotion(promotionId);
      if (!promotion)
        return res.status(404).json({ message: "Failed to delete promotion" });

      return res.status(200).json(promotion);
    } catch (error) {
      console.log(`deletePromotion() error: ${error}`);
      return res.status(500).json({ message: error.message });
    }
  },
};
