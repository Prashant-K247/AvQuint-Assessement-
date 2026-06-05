import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

connectDB();

app.use(
  cors({
    origin: [
      "https://avquint-assessement.onrender.com/api",
      "https://av-quint-assessement.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use('/api/auth',authRouter);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server up at ${PORT}`);
})