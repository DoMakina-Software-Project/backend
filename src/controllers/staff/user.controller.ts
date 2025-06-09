import { Request, Response } from "express";
import { UserService } from "../../services";
import type { UserWithRoles } from "../../services/user.service";

interface AuthenticatedRequest extends Request {
	user?: UserWithRoles;
}

export default {
	getAllUsers: async (req: AuthenticatedRequest, res: Response) => {
		try {
			const { page, role } = req.query;
			const pageNumber = page ? Number(page) : 1;
			const roleFilter = role as string | undefined;
			const currentUser = req.user;

			// Staff cannot view admin users, but admin can view all
			if (
				roleFilter &&
				["STAFF", "SUPERADMIN"].includes(roleFilter.toUpperCase())
			) {
				if (!currentUser?.roles.includes("SUPERADMIN")) {
					return res.status(403).json({
						message: "Staff cannot view admin users",
					});
				}
			}

			const users = await UserService.getAllUsers(pageNumber, roleFilter);

			// Filter out admin users for staff
			if (!currentUser?.roles.includes("SUPERADMIN")) {
				users.results = users.results.filter(
					(user) =>
						!user.roles.includes("STAFF") &&
						!user.roles.includes("SUPERADMIN")
				);
				users.totalItems = users.results.length;
				users.totalPages = Math.ceil(users.totalItems / 10);
				users.hasNextPage = pageNumber * 10 < users.totalItems;
			}

			return res.json(users);
		} catch (error) {
			console.error("UserController.getAllUsers error:", error);
			return res.status(500).json({ message: "Internal server error" });
		}
	},

	getUserById: async (req: AuthenticatedRequest, res: Response) => {
		try {
			const { id } = req.params;
			const currentUser = req.user;
			const user = await UserService.getUserById(Number(id));

			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			// Staff cannot view admin users
			if (!currentUser?.roles.includes("SUPERADMIN")) {
				if (
					user.roles.includes("STAFF") ||
					user.roles.includes("SUPERADMIN")
				) {
					return res.status(403).json({
						message: "Staff cannot view admin users",
					});
				}
			}

			return res.json(user);
		} catch (error) {
			console.error("UserController.getUserById error:", error);
			return res.status(500).json({ message: "Internal server error" });
		}
	},

	getUsersByRole: async (req: AuthenticatedRequest, res: Response) => {
		try {
			const { role } = req.params;
			const { page } = req.query;
			const pageNumber = page ? Number(page) : 1;
			const currentUser = req.user;

			// Staff cannot view admin users
			if (["STAFF", "SUPERADMIN"].includes(role.toUpperCase())) {
				if (!currentUser?.roles.includes("SUPERADMIN")) {
					return res.status(403).json({
						message: "Staff cannot view admin users",
					});
				}
			}

			const users = await UserService.getUsersByRole(
				role.toUpperCase(),
				pageNumber
			);
			return res.json(users);
		} catch (error) {
			console.error("UserController.getUsersByRole error:", error);
			return res.status(500).json({ message: "Internal server error" });
		}
	},

	updateUserStatus: async (req: AuthenticatedRequest, res: Response) => {
		try {
			const { id } = req.params;
			const { status } = req.body;
			const currentUser = req.user;

			// Validate status
			const validStatuses = ["ACTIVE", "INACTIVE", "BANNED", "DELETED"];
			if (!validStatuses.includes(status)) {
				return res.status(400).json({
					message:
						"Invalid status. Must be one of: " +
						validStatuses.join(", "),
				});
			}

			const user = await UserService.getUserById(Number(id));
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			// Prevent users from changing their own status to anything other than ACTIVE
			if (currentUser?.id === Number(id) && status !== "ACTIVE") {
				return res.status(400).json({
					message: "You cannot change your own status",
				});
			}

			// Staff cannot modify admin users
			if (!currentUser?.roles.includes("SUPERADMIN")) {
				if (
					user.roles.includes("STAFF") ||
					user.roles.includes("SUPERADMIN")
				) {
					return res.status(403).json({
						message: "Staff cannot modify admin users",
					});
				}
			}

			const updated = await UserService.updateUserStatus(
				Number(id),
				status
			);

			if (!updated) {
				return res.status(404).json({ message: "User not found" });
			}

			return res.json({
				message: `User status updated to ${status} successfully`,
			});
		} catch (error) {
			console.error("UserController.updateUserStatus error:", error);
			return res.status(500).json({ message: "Internal server error" });
		}
	},

	banUser: async (req: AuthenticatedRequest, res: Response) => {
		try {
			const { id } = req.params;
			const currentUser = req.user;

			const user = await UserService.getUserById(Number(id));
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			// Prevent users from banning themselves
			if (currentUser?.id === Number(id)) {
				return res.status(400).json({
					message: "You cannot ban yourself",
				});
			}

			// Staff cannot ban admin users
			if (!currentUser?.roles.includes("SUPERADMIN")) {
				if (
					user.roles.includes("STAFF") ||
					user.roles.includes("SUPERADMIN")
				) {
					return res.status(403).json({
						message: "Staff cannot ban admin users",
					});
				}
			}

			const banned = await UserService.banUser(Number(id));

			if (!banned) {
				return res.status(404).json({ message: "User not found" });
			}

			return res.json({ message: "User banned successfully" });
		} catch (error) {
			console.error("UserController.banUser error:", error);
			return res.status(500).json({ message: "Internal server error" });
		}
	},

	unbanUser: async (req: AuthenticatedRequest, res: Response) => {
		try {
			const { id } = req.params;
			const currentUser = req.user;

			const user = await UserService.getUserById(Number(id));
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			// Staff cannot unban admin users
			if (!currentUser?.roles.includes("SUPERADMIN")) {
				if (
					user.roles.includes("STAFF") ||
					user.roles.includes("SUPERADMIN")
				) {
					return res.status(403).json({
						message: "Staff cannot unban admin users",
					});
				}
			}

			const unbanned = await UserService.unbanUser(Number(id));

			if (!unbanned) {
				return res.status(404).json({ message: "User not found" });
			}

			return res.json({ message: "User unbanned successfully" });
		} catch (error) {
			console.error("UserController.unbanUser error:", error);
			return res.status(500).json({ message: "Internal server error" });
		}
	},

	getUserStatistics: async (req: AuthenticatedRequest, res: Response) => {
		try {
			const stats = await UserService.getUserStatistics();
			return res.json(stats);
		} catch (error) {
			console.error("UserController.getUserStatistics error:", error);
			return res.status(500).json({ message: "Internal server error" });
		}
	},

	updateUser: async (req: AuthenticatedRequest, res: Response) => {
		try {
			const { id } = req.params;
			const { name, surname, email } = req.body;
			const currentUser = req.user;

			const user = await UserService.getUserById(Number(id));
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			// Staff cannot update admin users (only admins can do full user edits)
			if (!currentUser?.roles.includes("SUPERADMIN")) {
				if (
					user.roles.includes("STAFF") ||
					user.roles.includes("SUPERADMIN")
				) {
					return res.status(403).json({
						message: "Only admins can edit user details",
					});
				}
			}

			// Check if email is already taken by another user
			if (email && email !== user.email) {
				const existingUser = await UserService.getUserByEmail(email);
				if (existingUser && existingUser.id !== Number(id)) {
					return res.status(400).json({
						message: "Email is already taken",
					});
				}
			}

			const updateData: any = {};
			if (name) updateData.name = name;
			if (surname) updateData.surname = surname;
			if (email) updateData.email = email;

			const updated = await UserService.updateUserById(
				Number(id),
				updateData
			);

			if (!updated) {
				return res.status(404).json({ message: "User not found" });
			}

			return res.json({ message: "User updated successfully" });
		} catch (error) {
			console.error("UserController.updateUser error:", error);
			return res.status(500).json({ message: "Internal server error" });
		}
	},
};
