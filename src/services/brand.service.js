import { BrandModel } from "../models/index.js";

const BrandService = {
  getBrandById: async (brandId) => {
    try {
      const brand = await BrandModel.findByPk(brandId);
      return brand ? brand.toJSON() : null;
    } catch (error) {
      console.log(`BrandService.getBrandByID() error: ${error}`);
      throw error;
    }
  },

  createBrand: async ({ brandId, name, iconUrl }) => {
    try {
      const existingBrand = await BrandService.getBrandById(brandId);
      if (existingBrand) throw new Error("Brand already exists");

      const brand = await BrandModel.create({
        brandId,
        name,
        iconUrl,
      });
      return brand ? brand.toJSON() : null;
    } catch (error) {
      console.log(`BrandService.createBrand() error: ${error}`);
      throw error;
    }
  },

  updateBrand: async ({ brandId, name, iconUrl }) => {
    try {
      const brand = await BrandModel.findByPk(brandId);
      if (!brand) throw new Error("Brand not found");

      brand.name = name;
      brand.iconUrl = iconUrl;
      await brand.save();
      return brand.toJSON();
    } catch (error) {
      console.log(`BrandService.updateBrand() error: ${error}`);
      throw error;
    }
  },

  deleteBrand: async (brandId) => {
    try {
      const brand = await BrandModel.findByPk(brandId);
      if (!brand) throw new Error("Brand not found");

      await brand.destroy();
      return brand.toJSON();
    } catch (error) {
      console.log(`BrandService.deleteBrand() error: ${error}`);
      throw error;
    }
  },
};
export default BrandService;
