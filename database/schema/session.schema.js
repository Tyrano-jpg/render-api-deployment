import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  session_name: {
    type: String,
    trim: true,
    required: [true, "Name is required."],
    default: null,
  },
  session_description: {
    type: String,
    required: [true, "Description is required."],
    trim: true,
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "room",
    indexedDB: true,
    required: [true, "Room Id is required."],
    default: null,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const sessionModel = mongoose.model("session", SessionSchema);
export default sessionModel;
