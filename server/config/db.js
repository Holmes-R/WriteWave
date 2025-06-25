import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGOURL}/quickblog`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await mongoose.connect(process.env.MONGOURL + "/quickblog", {
      serverSelectionTimeoutMS: 5000 // fail in 5 seconds
    });
    
  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
  
};

export default connectDB;
