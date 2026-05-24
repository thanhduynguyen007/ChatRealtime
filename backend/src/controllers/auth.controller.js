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
            displayName: `${lastName} ${firstName}`
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

        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_TTL })
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
        res.status(200).json({ message: `${user.displayName} đã login`, accessToken })
    } catch (err) {
        console.log("Lỗi khi gọi signIn", err);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
export const signOut = async (req, res) => {
    try {
        // lấy refresh token từ cookie
        const token = req.cookies?.refreshToken;
        if (token) {
            // Xoá refresh token trogn Session
            await Session.deleteOne({ refreshToken: token });
            // xoá cookie
            res.clearCookie('refreshToken')
        }
        return res.sendStatus(204)
    } catch (err) {
        console.log("Lỗi khi gọi signIn", err);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
// tạo access token mới từ refresh token
export const refreshToken = async (req, res) => {
    try {
        // lấy refresh token từ cookie
        const token = req.cookies?.refreshToken;
        if (!token) {
            return res.status(401).json({ message: "Token không tồn tại" });
        }

        // so với refreshtoken trong db
        const session = await Session.findOne({ refreshToken: token });
        if (!session) {
            return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
        }

        //Kiêm tra token hết hạn chưa
        if (session.expiresAt < new Date()) {
            return res.status(403).json({ message: "Token đã hết hạn" });
        }
        //tạo accesstoken mới
        const accessToken = await jwt.sign({
            userId: session.userId,
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_TTL });

        //return
        return res.status(200).json({ accessToken });
    } catch (error) {
        console.log("Lỗi khi gọi refresh", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}