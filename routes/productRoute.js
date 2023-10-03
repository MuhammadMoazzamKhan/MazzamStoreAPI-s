import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProductDetails, updateProduct } from "../controller/productController.js";
import { isAuthenticateduser, unAuthorizedRoles} from "../middleware/auth.js";

const router = express.Router();

router.route("/products").get(isAuthenticateduser,unAuthorizedRoles("admin"), getAllProducts);
router.route("/product/new").post(isAuthenticateduser,unAuthorizedRoles("admin"), createProduct);
router.route("/product/:id")
.put(isAuthenticateduser, updateProduct)
.delete(isAuthenticateduser, deleteProduct)
.get(isAuthenticateduser, getProductDetails);

export default router;
