import mongoose, { Schema } from "mongoose";

export interface IUser {
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  _doc: any;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema({
    email: { type: String, unique: true, required: true },
    passwordHash: String,
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
        required: true
  },
},{
    timestamps:true
})


export const User =  mongoose.model<IUser>('User', userSchema);