import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addItemToCart, decrementItemCountFromCart, getCartDetails, removeItemFromCart } from "../controllers/cart.controller.js";

const router = Router();

router.route("/addItem").post(authMiddleware, addItemToCart);
router.route("/removeItem").post(authMiddleware, removeItemFromCart);
router.route("/decrementItemCount").post(authMiddleware, decrementItemCountFromCart);
router.route("/").get(authMiddleware, getCartDetails);

export default router;