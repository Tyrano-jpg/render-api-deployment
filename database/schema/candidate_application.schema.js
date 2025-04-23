import mongoose, { Schema } from "mongoose";

const applicationSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: [true, "Name is required."],
    trim: true,
  },
  email_id: {
    type: String,
    required: [true, "Email is required."],
    trim: true,
    // unique: true,
  },
  phone_no: {
    type: Number,
    required: [true, "Phone Number is required."],
    trim: true,
    // unique: true,
  },

  linkedin_url: {
    type: String,
    trim: true,
  },
  resume_file: {
    type: Schema.Types.Mixed,
    required: true,
  },
  stack: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  }
});

const applicationModel = mongoose.model("application", applicationSchema);
export default applicationModel;
