import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createOrderAndPaymentInitiator, verifyOrderPayment } from "../controllers/order.controller.js";

const router = Router();

router.route("/payment").post(authMiddleware, createOrderAndPaymentInitiator);
router.route("/verifyPayment").post(authMiddleware, verifyOrderPayment);

export default router;