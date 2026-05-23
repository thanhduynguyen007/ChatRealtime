import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

//middleware
app.use(express.json());
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server bắt đầu trên cổng ${PORT}`);
    })
});
