import express from "express";
import cors from "cors"
import bodyParser from 'body-parser'
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json())
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());
// Route Import
import product from "./routes/productRoute.js";
import user from "./routes/userRoute.js"
import order from "./routes/orderRoute.js"
app.use("/api/v1", product)
app.use("/api/v1", user)
app.use("/api/v1", order)

export default app;