import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { addFoodItem, getFoodItemDetails, getFoodItemsList, removeFoodItem, updateFoodItem } from "../controllers/foodItem.controller.js";

const router = Router();

router.route("/").get(authMiddleware, roleMiddleware(["admin", "manager"]), getFoodItemsList);
router.route("/:foodItemId").get(authMiddleware, roleMiddleware(["admin", "manager"]), getFoodItemDetails);
router.route("/add").post(authMiddleware, roleMiddleware(["admin", "manager"]), upload.single("image"), addFoodItem);
router.route("/remove/:foodItemId").post(authMiddleware, roleMiddleware(["admin", "manager"]), removeFoodItem);
router.route("/update").put(authMiddleware, roleMiddleware(["admin", "manager"]), upload.single("image"), updateFoodItem);

export default router;