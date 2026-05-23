import mongoose from 'mongoose';
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log("Liên kết thành công");
    } catch (err) {
        console.log("Lỗi khi kết nối CSDL: ", err);
        process.exit(1);
    }
}