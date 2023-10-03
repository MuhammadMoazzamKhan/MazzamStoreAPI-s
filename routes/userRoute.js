import express  from "express";
import { createUser, fetchAllUser, forgotPassword, login,logout } from "../controller/userController.js";

const router = express.Router();

router.route("/register").post(createUser)
router.route("/login").post(login)
router.route("/fetchusers").get(fetchAllUser)
router.route("/reset-password").post(forgotPassword)
router.route("/logout").post(logout)

export default router