import { UserRoleService } from ".";
import { CarService } from ".";
import { PromotionService } from ".";
import { BrandService } from ".";

type TopBrand = {
	id: number;
	name: string;
	carCount: number;
};

type DashboardResponse = {
	numberOfClients: number;
	numberOfSellers: number;
	numberOfStaff: number;
	numberOfSuperAdmins: number;
	numberOfCars: number;
	numberOfSoldCars: number;
	totalRevenue: number;
	yearRevenue: number;
	monthRevenue: number;
	weekRevenue: number;
	todayRevenue: number;
	numberOfBrands: number;
	topFiveBrands: TopBrand[];
};

const DashboardService = {
	getDashboard: async (): Promise<DashboardResponse> => {
		try {
			const [
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
			] = await Promise.all([
				UserRoleService.getCountOfUsersByRole("CLIENT"),
				UserRoleService.getCountOfUsersByRole("SELLER"),
				UserRoleService.getCountOfUsersByRole("STAFF"),
				UserRoleService.getCountOfUsersByRole("SUPERADMIN"),
				CarService.getCountOfCars(),
				CarService.getCountOfSoldCars(),
				PromotionService.getTotalRevenue(),
				PromotionService.getYearlyRevenue(),
				PromotionService.getMonthlyRevenue(),
				PromotionService.getWeeklyRevenue(),
				PromotionService.getDailyRevenue(),
				BrandService.getBrandCount(),
				BrandService.getTopFiveBrands(),
			]);

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
			console.error("DashboardService.getDashboard error:", error);
			throw error;
		}
	},
};

export default DashboardService;
