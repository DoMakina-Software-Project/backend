import { UserRoleService } from "./index.js";

export default {
	getDashboard: async () => {
		try {
			const numberOfUser = await UserRoleService.getCountOfUsersByRole(
				"user"
			);

			const numberOfAdmins = await UserRoleService.getCountOfUsersByRole(
				"admin"
			);

			return {
				numberOfUser,
				numberOfAdmins,

				numberOfCars: 10,
				numberOfSoldCars: 5,

				totalRevenue: 1000000,
				yearRevenue: 500000,
				monthRevenue: 100000,
				weekRevenue: 50000,
				todayRevenue: 10000,

				numberOfBrands: 5,
				topFiveBrands: [
					{ brand: "Toyota", icon_url: "", totalCars: 10 },
					{ brand: "Ford", icon_url: "", totalCars: 8 },
					{ brand: "Chevrolet", icon_url: "", totalCars: 6 },
					{ brand: "Nissan", icon_url: "", totalCars: 4 },
					{ brand: "Honda", icon_url: "", totalCars: 2 },
				],
			};
		} catch (error) {
			console.log("dashboard.service.js: getDashboard: error: ", error);
			throw error;
		}
	},
};
