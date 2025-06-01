import { BrandModel, CarModel } from "../models/index.js";
import sequelize from "../config/db.js";

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

	createBrand: async ({ name, iconUrl }) => {
		try {
			const existingBrand = await BrandModel.findOne({
				where: { name },
			});

			if (existingBrand) {
				throw new Error("Brand already exists");
			}

			const brand = await BrandModel.create({
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

			if (name) brand.name = name;
			if (iconUrl) brand.iconUrl = iconUrl;
			await brand.save();

			return brand.toJSON();
		} catch (error) {
			console.log(`BrandService.updateBrand() error: ${error}`);
			throw error;
		}
	},

	deleteBrand: async (brandId) => {
		try {
			const brand = await BrandModel.findByPk(brandId, {
				include: [
					{
						model: CarModel,
					},
				],
			});

			if (!brand) throw new Error("Brand not found");

			if (brand.Cars.length > 0) {
				throw new Error("Brand has associated cars");
			}

			await brand.destroy();
			return brand.toJSON();
		} catch (error) {
			console.log(`BrandService.deleteBrand() error: ${error}`);
			throw error;
		}
	},
	getAllBrands: async () => {
		try {
			const brands = await BrandModel.findAll();
			return brands.map((brand) => brand.toJSON());
		} catch (error) {
			console.log(`BrandService.getAllBrands() error: ${error}`);
			throw error;
		}
	},
	getBrandCount: async () => {
		try {
			const count = await BrandModel.count();
			return count;
		} catch (error) {
			console.log(`BrandService.getBrandCount() error: ${error}`);
			throw error;
		}
	},

	getTopFiveBrands: async () => {
		try {
			const [results] = await sequelize.query(`
				SELECT 
					brand.id, 
					brand.name, 
					brand.icon_url, 
					COUNT(car.id) AS totalCars
				FROM brand
				LEFT JOIN car ON brand.id = car.brand_id
				GROUP BY brand.id
				ORDER BY totalCars DESC
				LIMIT 5;
			`);

			// Format the results
			return results.map((brand) => ({
				brand: brand.name,
				icon_url: brand.icon_url,
				totalCars: parseInt(brand.totalCars),
			}));
		} catch (error) {
			console.log(`BrandService.getTopFiveBrands() error: ${error}`);
			throw error;
		}
	},
};
export default BrandService;
