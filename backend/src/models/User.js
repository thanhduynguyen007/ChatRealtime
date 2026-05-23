import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    hashPassword: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    displayName: {
        type: String,
        require: true,
        trim: true
    },
    avatarUrl: {
        type: String,
    },
    avatarId: {
        type: String,
    },
    bio: {
        type: String,
        maxlength: 500
    },
    phone: {
        type: String,
        sparse: true,
    }
}
    , {
        timestamps: true
    })

const User = mongoose.model("User", userSchema)
export default User