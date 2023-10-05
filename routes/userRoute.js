import express from "express";
import { createUser, deleteUser, fetchAllUser, forgotPassword, getSingleUser, getUserDetails, login, logout, resetPassword, updatePassword, updateProfile, updateUser } from "../controller/userController.js";
import { isAuthenticateduser, unAuthorizedRoles } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(createUser)
router.route("/login").post(login)
router.route("/logout").post(logout)
router.route("/password/reset-password").post(forgotPassword)
router.route("/password/reset-password/:token").post(resetPassword)
router.route("/password/update").put(isAuthenticateduser, updatePassword)


router.route("/me").get(isAuthenticateduser, getUserDetails)
router.route("/me/update").put(isAuthenticateduser, updateProfile)


router.route("/admin/users").get(isAuthenticateduser, unAuthorizedRoles('admin'), fetchAllUser)
router.route("/admin/user/:id")
    .get(isAuthenticateduser, unAuthorizedRoles('admin'), getSingleUser)
    .delete(isAuthenticateduser, unAuthorizedRoles('admin'), deleteUser)
    .put(isAuthenticateduser, unAuthorizedRoles('admin'), updateUser)

export default router