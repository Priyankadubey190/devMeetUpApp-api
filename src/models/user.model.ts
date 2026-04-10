import { Schema, model } from "mongoose";
import { Roles } from "../config/roles";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config/config";

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName?: string;
  emailId: string;
  password: string;
  age?: number;
  gender?: string;
  photoUrl?: string;
  about?: string;
  skills?: string[];
  role: string;

  createdAt: Date;
  updatedAt: Date;
}

export const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, minLength: 3, maxLength: 50 },
    lastName: { type: String },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    age: { type: Number, min: 18, max: 50 },
    gender: { type: String },
    photoUrl: {
      type: String,
      default:
        "https://plus.unsplash.com/premium_photo-1677252438411-9a930d7a5168?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },
    about: { type: String, default: "This is default about for user" },
    skills: { type: [String] },
    role: {
      type: String,
      enum: Roles.roles,
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, config.jwt.secret, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (
  passwordInputByUser: string,
) {
  const user = this;

  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash,
  );

  return isPasswordValid;
};

export const User = model<IUser>("User", userSchema);
