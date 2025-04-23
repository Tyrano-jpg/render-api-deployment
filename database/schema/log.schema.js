// import mongoose from "mongoose";

// const LogSchema = new mongoose.Schema({
//   guest_id: { type: mongoose.Schema.Types.ObjectId, ref: "guest", indexedDB: true, default: null },
//   entry_time: { type: Date, required: [true, "Entry time is required."] },
//   room_no: { type: mongoose.Schema.Types.ObjectId, ref: "room", indexedDB: true, required: [true, "Room id is required."] },
//   created_at: { type: Date, default: Date.now },
//   updated_at: { type: Date, default: Date.now },
//   deleted_at: { type: Date, default: null },
// });

// const logModel = mongoose.model("logs", LogSchema);
// export default logModel;
import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  guest_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "guest",
    indexedDB: true,
    default: null,
  },
  entry_in_time: { type: Date, default: null },
  entry_out_time: { type: Date, default: null },
  entry_type: { type: String, required: [true, "Entry type is required."] },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "room",
    indexedDB: true,
    required: [true, "Room id is required."],
  },
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "session",
    indexedDB: true,
    required: [true, "Session id is required."],
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const logModel = mongoose.model("logs", LogSchema);
export default logModel;
