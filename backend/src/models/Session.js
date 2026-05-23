import mongoose from "mongoose";
const sesstionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
})
//Tự đọng xoá khi hết hạng
sesstionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.model('Session', sesstionSchema)