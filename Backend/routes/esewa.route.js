import { Router } from "express";
import { initiateEsewaPayment, verifyEsewaPayment, getOrders } from "../controller/esewa.controller.js";
import { checkToken, checkRole } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/initiate", initiateEsewaPayment);
router.post("/verify", verifyEsewaPayment);
router.get("/orders", checkToken, checkRole(['admin']), getOrders);

export default router;
