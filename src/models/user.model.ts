import mongoose, { Schema } from "mongoose";

export const userSchema = new Schema({
  firstName: { type: String, require: true },
  lastName: { type: String },
  emailId: { type: String, unique: true, lowerCase: true },
  password: { type: String },
  age: { type: Number },
  gender: { type: String },
  photoUrl: {
    type: String,
    default:
      "https://plus.unsplash.com/premium_photo-1677252438411-9a930d7a5168?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
  },
  about: { type: String, default: "This is default about for user" },
  skills: { type: String },
});
