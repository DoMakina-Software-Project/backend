import { Request, Response } from "express";
import { BrandService } from "../../services";
import type { UserWithRoles } from "../../services/user.service";

interface StaffRequest extends Request {
	user: UserWithRoles;
	iconUrl?: string;
}

const StaffBrandController = {
	async getBrand(req: Request, res: Response): Promise<void> {
		try {
			const brandId = req.params.id;
			const brand = await BrandService.getBrandById(Number(brandId));
			if (!brand) {
				res.status(404).json({ message: "Brand not found" });
				return;
			}
			res.status(200).json(brand);
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	},

	async createBrand(req: StaffRequest, res: Response): Promise<void> {
		try {
			const { name } = req.body;
			const iconUrl = req.iconUrl;
			if (!iconUrl) {
				res.status(400).json({ message: "Icon is required" });
				return;
			}

			const newBrand = await BrandService.createBrand({
				name,
				iconUrl,
			});
			if (!newBrand) {
				res.status(400).json({ message: "Failed to create brand" });
				return;
			}
			res.status(201).json(newBrand);
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	},

	async updateBrand(req: StaffRequest, res: Response): Promise<void> {
		try {
			const brandId = req.params.id;
			const { name } = req.body;
			const iconUrl = req.iconUrl;

			const newBrand = await BrandService.updateBrand({
				brandId: Number(brandId),
				name,
				iconUrl,
			});
			if (!newBrand) {
				res.status(404).json({ message: "Brand not found" });
				return;
			}
			res.status(200).json(newBrand);
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	},

	async deleteBrand(req: Request, res: Response): Promise<void> {
		try {
			const brandId = req.params.id;
			const brand = await BrandService.deleteBrand(Number(brandId));
			if (!brand) {
				res.status(404).json({ message: "Brand not found" });
				return;
			}
			res.status(200).json({ message: "Brand deleted successfully" });
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	},

	async getAllBrands(req: Request, res: Response): Promise<void> {
		try {
			const { page } = req.query;
			const pageNumber = page ? Number(page) : 1;
			const brands = await BrandService.getAllBrands(pageNumber);
			res.status(200).json(brands);
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	},
};

export default StaffBrandController;
