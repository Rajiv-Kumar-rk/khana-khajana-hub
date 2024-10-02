import { Router } from "express";
import { addItemToWishlist, getWishlistDetails, removeItemFromWishlist } from "../controllers/wishlist.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/addItem").post(authMiddleware, addItemToWishlist);
router.route("/removeItem").post(authMiddleware, removeItemFromWishlist);
router.route("/").get(authMiddleware, getWishlistDetails);

export default router;