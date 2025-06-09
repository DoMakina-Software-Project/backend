import { Router } from "express";
import { UserValidator } from "../validators";
import { UserController } from "../../../controllers/staff";
import { throwValidationErrors } from "../validators";

const router = Router();

// Get all users with optional role filter and pagination
router.get(
	"/",
	UserValidator.getAllUsersValidation,
	throwValidationErrors,
	UserController.getAllUsers
);

// Get user statistics
router.get("/statistics", UserController.getUserStatistics);

// Get users by role with pagination
router.get(
	"/role/:role",
	UserValidator.getUsersByRoleValidation,
	throwValidationErrors,
	UserController.getUsersByRole
);

// Get user by id
router.get(
	"/:id",
	UserValidator.getUserByIdValidation,
	throwValidationErrors,
	UserController.getUserById
);

// Update user details (admin only functionality)
router.put(
	"/:id",
	UserValidator.updateUserValidation,
	throwValidationErrors,
	UserController.updateUser
);

// Update user status
router.patch(
	"/:id/status",
	UserValidator.updateUserStatusValidation,
	throwValidationErrors,
	UserController.updateUserStatus
);

// Ban user
router.patch(
	"/:id/ban",
	UserValidator.banUserValidation,
	throwValidationErrors,
	UserController.banUser
);

// Unban user
router.patch(
	"/:id/unban",
	UserValidator.unbanUserValidation,
	throwValidationErrors,
	UserController.unbanUser
);

export default router;
