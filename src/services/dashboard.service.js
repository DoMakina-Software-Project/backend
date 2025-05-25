import { UserRoleService } from "./index.js";
import { CarService } from "./index.js";
import { PromotionService } from "./index.js";
import { BrandService } from "./index.js";

export default {
	getDashboard: async () => {
		try {
			const numberOfClients = await UserRoleService.getCountOfUsersByRole(
				"CLIENT"
			);

			const numberOfSellers = await UserRoleService.getCountOfUsersByRole(
				"SELLER"
			);

			const numberOfStaff = await UserRoleService.getCountOfUsersByRole(
				"STAFF"
			);

			const numberOfSuperAdmins =
				await UserRoleService.getCountOfUsersByRole("SUPERADMIN");

			const numberOfCars = await CarService.getCountOfCars();

			const numberOfSoldCars = await CarService.getCountOfSoldCars();

			const totalRevenue = await PromotionService.getTotalRevenue();
			const yearRevenue = await PromotionService.getYearlyRevenue();
			const monthRevenue = await PromotionService.getMonthlyRevenue();
			const weekRevenue = await PromotionService.getWeeklyRevenue();
			const todayRevenue = await PromotionService.getDailyRevenue();
			const numberOfBrands = await BrandService.getBrandCount();
			const topFiveBrands = await BrandService.getTopFiveBrands();
			return {
				numberOfClients,
				numberOfSellers,
				numberOfStaff,
				numberOfSuperAdmins,

				numberOfCars,
				numberOfSoldCars,

				totalRevenue,
				yearRevenue,
				monthRevenue,
				weekRevenue,
				todayRevenue,

				numberOfBrands,
				topFiveBrands,
			};
		} catch (error) {
			console.log("dashboard.service.js: getDashboard: error: ", error);
			throw error;
		}
	},
};
