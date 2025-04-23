import { Unique } from "@tensorflow/tfjs";
import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  room_no: {
    type: String,
    trim: true,
    required: [true, "Room Name is required."],
    default: null,
    unique: true,
  },
  status: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
});

const room_view_schema = new mongoose.Schema(
  {},
  {
    strict: false,
    autoCreate: false,
    autoIndex: false,
  }
);

const room_views = mongoose.model("room_views", room_view_schema);

(async function () {
  await room_views.createCollection({
    viewOn: "rooms",
    pipeline: [
      {
        $lookup: {
          from: "sessions",
          localField: "_id",
          foreignField: "room_id",
          pipeline: [
            {
              $sort: {
                created_at: 1,
              },
            },
            {
              $lookup: {
                from: "logs",
                localField: "_id",
                foreignField: "session_id",
                pipeline: [
                  {
                    $sort: {
                      created_at: 1,
                    },
                  },
                  {
                    $lookup: {
                      from: "guests",
                      localField: "guest_id",
                      foreignField: "_id",
                      pipeline: [
                        {
                          $project: {
                            full_name: 1,
                          },
                        },
                      ],
                      as: "guest_id",
                    },
                  },
                  {
                    $unwind: {
                      path: "$guest_id",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                  {
                    $project: {
                      guest_id: 1,
                      entry_in_time: 1,
                    },
                  },
                ],
                as: "logs",
              },
            },
            {
              $project: {
                session_name: 1,
                session_description: 1,
                logs: 1,
              },
            },
          ],
          as: "session",
        },
      },
      {
        $project: {
          room_no: 1,
          session: 1,
        },
      },
    ],
  });
})();

const roomModel = mongoose.model("room", RoomSchema);
export { roomModel, room_views };
