import User from "../model/userModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import sendToken from "../utils/jwttoken.js";
import sendEmail from "../utils/sendEmail.js"

export const createUser = async (req, res) => {
    let success = false;
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success, message: "Sorry a user with this email already exists" });
        }
        const salt = await bcrypt.hash(req.body.password, 10);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: salt,
            avatar: {
                public_id: "this is a sample id",
                url: "profilePicUrl"
            }
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        success = true
        sendToken(authToken, success, 200, res)

    } catch (error) {
        console.log(error.message)
        res.status(500).send({ success: false, status: 500, error: error.message });
    }
}


export const login = async (req, res) => {
    let success = false;
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success, message: 'Please try to login with correct credentials' });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);


        if (!passwordCompare) {
            return res.status(400).json({ success, message: "Please try to login with correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, process.env.JWT_SECRET);
        success = true;
        sendToken(authToken, success, 200, res)
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ success: false, status: 500, error: error.message });
    }
}

export const getUserDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select("-password");

        res.send(user);

    } catch (error) {
        console.log(error.message)
        res.status(500).send({ success: false, status: 500, error: error.message });
    }
}
export const logout = async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })


        res.status(200).json({
            success: true,
            message: "Logged Out"
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ success: false, status: 500, error: error.message });
    }

}

export const forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(res.status(404).send({
            seccess: false, status: 404, message: "User Not found"
        }));
    }
    // Get reset Password token 
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBefore: false })

    const resetLink = `${req.protocol}://${req.get("host")}/api/v1/reset-password/${resetToken}`;

    const message = `If you want to reset your password, click on the following link: ${resetLink}`
    try {
        await sendEmail({
            email: user.email,
            subject: `Moazzam Store password recovery`,
            message,
            res
        })
        return res.status(200).send(`Password reset email sent to ${user.email} successfully`);

    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBefore: false })
        return next(res.status(404).send({
            seccess: false, status: 400, message: error.message
        }));
    }

}

export const updatePassword = async (req, res, next) => {
    try {

        const { oldPassword,newPassword, confirmPassword } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);
        const passwordCompare = await bcrypt.compare(oldPassword, user.password);



        if (!passwordCompare) {
            return res.status(400).json({ success: false, message: "Old password is incorrect" });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Password does not match" });
        }
        const salt = await bcrypt.hash(confirmPassword, 10);

        user.password = salt;

        await user.save();

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        const success = true;

        sendToken(authToken, success, 200, res)

    } catch (error) {
        console.log(error.message)
        return next(res.status(404).send({
            seccess: false, status: 400, message: error.message
        }));
    }

}

export const resetPassword = async (req, res, next) => {
    try {
        const resetPasswordToken = req.params.token;

        const user = await User.findOne({
            resetPasswordToken, resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(404).send({
                seccess: false, status: 400, message: 'Reset Password Token is invalid or has been expired'
            });
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.status(404).send({
                seccess: false, status: 400, message: 'Password does not password'
            });
        }
        const salt = await bcrypt.hash(req.body.password, 10);
        user.password = salt;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        const success = true;
        sendToken(authToken, success, 200, res)
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ success: false, status: 500, error: error.message });
    }
}
