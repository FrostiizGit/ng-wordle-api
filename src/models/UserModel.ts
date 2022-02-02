import mongoose from "mongoose";
const { Schema } = mongoose;

const UserModel = mongoose.model('users', new Schema({
    username: String,
    password: String
}));

export default UserModel;