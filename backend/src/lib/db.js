import mongoose from "mongoose"

const connectDB=async()=>{
      try{
            const conn=await mongoose.connect(process.env.MONGO_URI);
            console.log(`Connected to MongoDB ${conn.connection.host}`)
      }catch(err){
            console.log("Failed to connect to MongoDB ",err.message)
            process.exit(1);
      }
}
export default connectDB