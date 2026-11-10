import mongoose from "mongoose";
import "dotenv/config"



const connectDb  = async()  : Promise<void>=>{
 try {
    const conn  = await mongoose.connect(process.env.MONGO_URI as string)
    console.log(`DB CONNECTION SUCCESS : ${conn.connection.name}`);
    
 } catch (error : unknown) {
    console.log(`DB CONNECTION FAILED: ${error}`);
 }
}

export default connectDb