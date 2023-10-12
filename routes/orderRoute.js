import express from "express";
import { isAuthenticateduser, unAuthorizedRoles } from "../middleware/auth.js";
import { deleteOrder, getAllOrders, getSingleOrder, myOrders, newOrder, updateOrder } from "../controller/orderController.js";

const router = express.Router();

router.route("/order/new").post(isAuthenticateduser, newOrder)
router.route("/order/:id").get(isAuthenticateduser, getSingleOrder)
router.route("/orders/me").get(isAuthenticateduser, myOrders)

router.route("/admin/orders").get(isAuthenticateduser, unAuthorizedRoles("admin"), getAllOrders);
router.route("/admin/order/:id")
    .put(isAuthenticateduser, unAuthorizedRoles("admin"), updateOrder)
    .delete(isAuthenticateduser, unAuthorizedRoles("admin"), deleteOrder);


export default router;
