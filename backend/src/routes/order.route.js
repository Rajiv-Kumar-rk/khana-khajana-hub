import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { createOrderAndPaymentInitiator, getAllOrdersList, getOnlyUserSpecificOrdersList, updateOrderStatus, verifyOrderPayment } from "../controllers/order.controller.js";

const router = Router();

router.route("/payment").post(authMiddleware, createOrderAndPaymentInitiator);
router.route("/verifyPayment").post(authMiddleware, verifyOrderPayment);
router.route("/updateStatus").post(authMiddleware, updateOrderStatus);
router.route("/getAllOrders").get(authMiddleware, roleMiddleware(["admin", "manager"]), getAllOrdersList);
router.route("/getOnlyUserSpecificOrdersList").get(authMiddleware, getOnlyUserSpecificOrdersList);

export default router;