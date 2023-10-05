import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
export const isAuthenticateduser = async (req, res, next) => {
    try {
        let token;
        if (req.headers.cookie) {
         token = req.headers.cookie.split("=")[1];
        } else {
            return next(res.status(401).send({ message: "Please login to access this resource" }))
        }
        if (!token) {
            return next(res.status(401).send({ message: "Please login to access this resource" }))
        }
        const decodedDate = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findById(decodedDate.user.id)
        next()
    } catch (error) {
        console.log(error.message)
        res.status(403).send({ success: false, status: 403, error: error.message });
    }
}
export const unAuthorizedRoles = (...roles) => {
    try {
        return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                return next(res.status(403).send({
                    success: false,
                    status: 403, message: `Role ${req.user.role} is not allowed to access this resource`
                }))
            }
            next()
        }
    } catch (error) {
        console.log(error.message)
        res.status(403).send({ success: false, status: 403, error: error.message });
    }
}

