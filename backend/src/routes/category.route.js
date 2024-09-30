import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addCategory, getCategoriesList, removeCategory, updateCategory } from "../controllers/category.controller.js";

const router = Router();

router.route("/").get(authMiddleware, getCategoriesList);
router.route("/add").post(authMiddleware, addCategory);
router.route("/remove/:categoryId").post(authMiddleware, removeCategory);
router.route("/update").post(authMiddleware, updateCategory);

export default router;