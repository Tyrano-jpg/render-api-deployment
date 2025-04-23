import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import getConfigs from "../../config/config.js";

const config = getConfigs();
const UserSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: [true, "User ID is required."],
    indexedDB: true,
    trim: true,
    unique: [true, "User ID already exist."],
  },
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
  },
  email_id: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: [true, "Email ID Required"],
    trim: true,
    unique: [true, "Email ID already exist."],
  },

  role: {
    type: String,
    required: [true, "User Role is required."],
    trim: true,
    enum: ["Admin", "Mobile"],
    default: "Admin",
  },
  password: { type: String, required: true, trim: true },
  mobile_no: {
    type: String,
    trim: true,
    default: null,
  },
  status: { type: Boolean, default: true },
  otp: { type: String, trim: true, default: null },
  assigned_room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "room",
    indexedDB: true,
    default: null,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

UserSchema.methods.jwtToken = function (next) {
  try {
    return jwt.sign(
      { id: this._id, userId: this.user_id, emailId: this.email_id },
      config.jwt.accessSecret,
      {
        expiresIn: config.jwt.accessOptions.expiresIn || "24hr",
      }
    );
  } catch (error) {
    return next(error);
  }
};

const userModel = mongoose.model("user", UserSchema);
export default userModel;
