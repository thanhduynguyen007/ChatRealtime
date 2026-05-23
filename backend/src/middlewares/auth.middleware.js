import jwt from "jsonwebtoken";
import User from '../models/User.js';
export const protectedRoute = async (req, res, next) => {
    try {
        //Lấy token từ header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Không tìm thấy accesstoken" })
        }
        const decodedUser = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );
        const user = await User.findById(decodedUser.userId).select("-hashPassword");

        if (!user) {
            return res.status(404).json({
                message: "Người dùng không tồn tại"
            });
        }

        // Trả user về cho các controller phía sau
        req.user = user;

        next();
        //Xác nhận token hợp lệ
        // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
        //     if (err) {
        //         console.error(err);
        //         return res.status(403).json({ message: "Access token hết hạn hoặc không hợp lệ" });
        //     }
        //     //tìm user
        //     const user = await User.findById(decodedUser.userId).select("-hashPassword");
        //     if (!user) {
        //         return res.status(404).json({ message: "Người dùng không tồn tại" })
        //     }
        //     //Trả về user trong req
        //     req.user = user;
        //     next();
        // })


    } catch (err) {
        console.error("Lỗi khi xác minh JWT trong authMiddleware", err);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}