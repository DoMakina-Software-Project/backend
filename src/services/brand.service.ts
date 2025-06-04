import { BrandModel, CarModel } from "../models";
import sequelize from "../config/db";
import { InferAttributes, QueryTypes } from "sequelize";

type Brand = InferAttributes<BrandModel>;

type BrandWithCars = Brand & {
	Cars?: InferAttributes<CarModel>[];
};

type TopBrand = Pick<Brand, "id" | "name" | "iconUrl"> & {
	carCount: number;
};

export default {
	getBrandById: async (brandId: number): Promise<Brand | null> => {
		try {
			const brand = await BrandModel.findByPk(brandId);
			return brand ? brand.toJSON() : null;
		} catch (error) {
			console.log(`BrandService.getBrandByID() error: ${error}`);
			throw error;
		}
	},

	createBrand: async ({
		name,
		iconUrl,
	}: Pick<Brand, "name" | "iconUrl">): Promise<Brand> => {
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
			return brand.toJSON();
		} catch (error) {
			console.log(`BrandService.createBrand() error: ${error}`);
			throw error;
		}
	},

	updateBrand: async ({
		brandId,
		name,
		iconUrl,
	}: { brandId: number } & Partial<
		Pick<Brand, "name" | "iconUrl">
	>): Promise<Brand> => {
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

	deleteBrand: async (brandId: number): Promise<Brand> => {
		try {
			const brand = await BrandModel.findByPk(brandId, {
				include: [
					{
						model: CarModel,
					},
				],
			});

			if (!brand) throw new Error("Brand not found");

			const brandWithCars = brand.toJSON() as BrandWithCars;
			if (brandWithCars.Cars && brandWithCars.Cars.length > 0) {
				throw new Error("Brand has associated cars");
			}

			await brand.destroy();
			return brand.toJSON();
		} catch (error) {
			console.log(`BrandService.deleteBrand() error: ${error}`);
			throw error;
		}
	},

	getAllBrands: async (): Promise<Brand[]> => {
		try {
			const brands = await BrandModel.findAll();
			return brands.map((brand) => brand.toJSON());
		} catch (error) {
			console.log(`BrandService.getAllBrands() error: ${error}`);
			throw error;
		}
	},

	getBrandCount: async (): Promise<number> => {
		try {
			const count = await BrandModel.count();
			return count;
		} catch (error) {
			console.log(`BrandService.getBrandCount() error: ${error}`);
			throw error;
		}
	},

	getTopFiveBrands: async (): Promise<TopBrand[]> => {
		try {
			const results = await sequelize.query<TopBrand>(
				`
                SELECT 
                    brand.id, 
                    brand.name, 
					brand.icon_url as iconUrl,
                    COUNT(car.id) AS carCount
                FROM brand
                LEFT JOIN car ON brand.id = car.brand_id
                GROUP BY brand.id
                ORDER BY carCount DESC
                LIMIT 5;
            `,
				{ type: QueryTypes.SELECT }
			);

			return results.map((brand: TopBrand) => ({
				id: brand.id,
				name: brand.name,
				iconUrl: brand.iconUrl,
				carCount: brand.carCount,
			}));
		} catch (error) {
			console.log(`BrandService.getTopFiveBrands() error: ${error}`);
			throw error;
		}
	},
};
