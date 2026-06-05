import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("DB Connected");
    console.log("Database:", conn.connection.name);
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;