import express from "express";
import cors from "cors"

const app = express();
app.use(express.json())
app.use(cors());
// Route Import
import product from "./routes/productRoute.js";
import user from "./routes/userRoute.js"
import order from "./routes/orderRoute.js"
app.use("/api/v1", product)
app.use("/api/v1", user)
app.use("/api/v1", order)

export default app;