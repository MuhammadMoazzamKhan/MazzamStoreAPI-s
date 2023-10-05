import express  from "express";
import { createUser, forgotPassword, getUserDetails, login,logout, resetPassword, updatePassword } from "../controller/userController.js";
import { isAuthenticateduser, unAuthorizedRoles} from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(createUser)
router.route("/login").post(login)
router.route("/me").get(isAuthenticateduser,getUserDetails)
router.route("/password/reset-password").post(forgotPassword)
router.route("/password/reset-password/:token").post(resetPassword)
router.route("/password/update").post(isAuthenticateduser,updatePassword)

router.route("/logout").post(logout)



export default router