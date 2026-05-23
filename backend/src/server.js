import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
//middleware
app.use(express.json());
app.use(cookieParser());
//Public routes
app.use("/api/auth", authRoute)
//private routes


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server bắt đầu trên cổng ${PORT}`);
    })
});
