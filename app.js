import  express  from "express";
const app = express();
app.use(express.json())
// Route Import
import product from "./routes/productRoute.js";
import user from "./routes/userRoute.js"
app.use("/api/v1" , product)
app.use("/api/v1" , user)

export default app;