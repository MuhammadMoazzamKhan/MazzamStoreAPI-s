import app from "./app.js";
import dotenv from "dotenv"
import connectdb from "./config/database.js";
dotenv.config({path:"config/config.env"})

const server =  app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})

connectdb()
process.on("unhandledRejection",(err )=>{
    console.log(`Error : ${err.message}`)
    console.log("Shuting down the server due to Unhandled Promise Rejection");

    server.close(()=>{
        process.exit(1) 
    })
})