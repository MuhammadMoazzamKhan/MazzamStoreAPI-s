import { v4 as uuidv4 } from 'uuid';
import mongoose from "mongoose";
import validator from "validator";

//     Create Schema 
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        minLength: [4, "Name should be atleast 4 characters"],
        maxLength: [30, "Name cannot exceed 30 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your passwrod"],
        minLength: [8, "Password should be atleast 8 characters"]
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});
// create token for reset Password

UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = uuidv4();
    this.resetPasswordToken = resetToken;
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000

    return resetToken;
};


//  create Model 
const User = mongoose.model("User", UserSchema)
export default User;