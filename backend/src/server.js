import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import userRoute from "./routes/user.route.js"
import friendRoute from "./routes/friend.route.js"
import messageRoute from "./routes/message.route.js"
import conversationRoute from "./routes/conversation.route.js"
import { protectedRoute } from "./middlewares/auth.middleware.js";
import swaggerUi from "swagger-ui-express"
import fs from "fs"
import cors from "cors"
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

//swagger 
const swaggerDocument = JSON.parse(fs.readFileSync("./src/swagger.json", "utf-8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
//Public routes
app.use("/api/auth", authRoute)
//private routes
app.use(protectedRoute);
app.use("/api/users", userRoute)
app.use("/api/friends", friendRoute)
app.use("/api/messages", messageRoute)
app.use("/api/conversations", conversationRoute)
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server bắt đầu trên cổng ${PORT}`);
    })
});
