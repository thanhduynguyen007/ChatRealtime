import bcrypt from 'bcrypt'
import User from '../models/User.js';
import jwt from "jsonwebtoken"
import crypto from "crypto"
import Session from '../models/Session.js';
import { response } from 'express';
export const signUp = async (req, res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body
        if (!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({ message: "Không thể thiếu username, password, email, firstName, lastName" });
        }
        console.log(username, password);

        //Kiểm tra user có tồn tại chưa
        const duplicate = await User.findOne({ username });
        if (duplicate) {
            return res.status(409).json({ message: "User name đã tồn tại" });
        }
        //mã hoá password
        const hashPassword = await bcrypt.hash(password, 10) // mã hoá 2^10 lần
        //tạo user mới 
        await User.create({
            username,
            hashPassword,
            email,
            displayName: `${firstName} ${lastName}`
        });
        //return 
        return res.sendStatus(204);

    } catch (err) {
        console.log("Lỗi khi gọi signUp", err);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }

};
export const signIn = async (req, res) => {
    try {
        // Lấy input
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Thiếu username hoặc password" })
        }
        //láy hashpassword trong db so sán với password
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Username hoặc password không chính xác" });
        }
        const passwordCorrect = await bcrypt.compare(password, user.hashPassword);
        if (!passwordCorrect) {
            return res.status(401).json({ message: "Username hoặc password không chính xác" });
        }
        //Nếu khớp tạo accsess token

        const acccessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_TTL })
        //tạo refresh token

        const refreshToken = crypto.randomBytes(64).toString('hex');
        //Tạo sesstion mới để lưu token
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + Number(process.env.REFRESH_TOKEN_TTL))
        })
        //trả refresh token về trong cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none", //backend frontend deloy riêng,
            maxAge: process.env.REFRESH_TOKEN_TTL
        })
        //Trả accsesstoken về trong res 
        res.status(200).json({ message: `${user.displayName} đã login`, acccessToken })
    } catch (err) {
        console.log("Lỗi khi gọi signIn", err);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
export const signOut = async (req, res) => {
    try {
        // lấy refresh token từ cookie
        // Xoá refresh token trogn Session
        // xoá cookie
    } catch (err) {
        console.log("Lỗi khi gọi signIn", err);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}