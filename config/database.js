import mongoose from "mongoose";

const connectdb = async()=>{
    try {
        const connect = await mongoose.connect(process.env.DB_URI,{useNewUrlParser:true,useUnifiedTopology:true})
        console.log(`Mongodb connected with server: ${connect.connection.host}`) 
    } catch (error) {
        console.log(error)
    }
}
export default connectdb;