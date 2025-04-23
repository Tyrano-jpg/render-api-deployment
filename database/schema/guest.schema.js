import mongoose from "mongoose";

const GuestSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: [true, "First name is required."],
    trim: true,
  },
  guest_id: {
    type: Number,
    required: [true, "Guest ID is required."],
    indexedDB: true,
    trim: true,
    unique: [true, "Guest ID already exist."],
  },
  designation: {
    type: String,
    // required: [true, "Designation is required."],
    trim: true,
    default: null,
  },
  category: {
    type: String,
    required: [true, "Category is required."],
    // default: null,
    trim: true,
  },

  company_name: {
    type: String,
    // required: [true, "Company name is required."],
    default: null,
    trim: true,
  },

  email_id: {
    type: String,
    minlength: 5,
    maxlength: 50,
    // required: [true, "Email ID Required"],
    trim: true,
    default: null,
    // unique: [true, "Email ID already exist."],
    sparse: true,
  },
  mobile_number: {
    type: String || Number,
    // required: [true, "mobile number is required"],
    default: null,
    // unique: [true, "mobile number must be unique"],
  },
  cha_license_number: {
    type: String || Number,
    // required: [true, "cha licenese number is required"],
    default: null,
    // unique: [true, "cha licenese number must be unique"],
  },
  gst_number: {
    type: String || Number,
    default: null,
    // required: [true, "gst number is required"],
    // unique: [true, "gst number must be unique"],
  },
  food_preference: {
    type: String,
    // required: [true, "food preference  is required"],
    enum: ["Veg", "Non-Veg", "Jain"],
    default: null,
  },

  status: { type: Boolean, default: true },
  attendance_status: {
    type: String,
    enum: ["Attended", "Not Attended"],
    default: "Not Attended",
  },

  in_time: { type: Date, default: null },
  registration_date: {
    type: Date,
    default: Date.now,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const guestModel = mongoose.model("guest", GuestSchema);
export default guestModel;
