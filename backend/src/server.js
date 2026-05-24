import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import userRoute from "./routes/user.route.js"
import { protectedRoute } from "./middlewares/auth.middleware.js";
import cors from "cors"
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
//Public routes
app.use("/api/auth", authRoute)
//private routes
app.use(protectedRoute);
app.use("/users", userRoute)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server bắt đầu trên cổng ${PORT}`);
    })
});
