import express from "express";
import { createProduct, createProductReview, deleteProduct, deleteReviews, getAllProducts, getAllReaviews, getProductDetails, updateProduct } from "../controller/productController.js";
import { isAuthenticateduser, unAuthorizedRoles } from "../middleware/auth.js";

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(isAuthenticateduser, unAuthorizedRoles("admin"), createProduct);

router.route("/admin/product/:id")
    .put(isAuthenticateduser, unAuthorizedRoles("admin"), updateProduct)
    .delete(isAuthenticateduser, unAuthorizedRoles("admin"), deleteProduct)

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticateduser, createProductReview)
router.route("/reviews").get(getAllReaviews).delete(isAuthenticateduser,deleteReviews)
export default router;
