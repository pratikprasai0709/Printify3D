import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username: String,
    password: String,
    phoneNumber: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

const User = model('User', userSchema);
export default User;



