import mongoose from "mongoose";
import catchAsync from "../../Utils/catchAsync.js";
import userModel from "../../database/schema/user.schema.js";
import bcrypt from "bcrypt";
import ApiError from "../../Utils/ApiError.js";

export const AddUser = catchAsync(async (req, res, next) => {
  const userData = req.body;
  const saltRounds = 10;
  if (req.body.role === "Mobile") {
    if (!req.body.assigned_room) {
      return res
        .status(401)
        .json({ status: false, message: "Please assign a room." });
    }

    // if (req.body.assigned_room) {
    //   let existingUser = await userModel.findOne({
    //     assigned_room: req.body.assigned_room,
    //   });
    //   if (existingUser) {
    //     return res.status(401).json({
    //       status: false,
    //       message: "Room has been already assigned to another user.",
    //     });
    //   }
    // }
  }

  if (!userData.password) {
    return next(new ApiError("Password is required", 404));
  }
  const latestUser = await userModel.find().sort({ user_id: -1 }).limit(1);
  const latestUserId = latestUser.length > 0 ? latestUser[0].user_id : 0;
  userData.user_id = latestUserId + 1;
  userData.password = await bcrypt.hash(userData.password, saltRounds);
  const newUser = new userModel(userData);
  const savedUser = await newUser.save();

  // Send a success response
  return res.status(201).json({
    status: true,
    data: savedUser,
    message: "User created successfully",
  });
});

export const UpdateUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;
  updateData.updated_at = Date.now();
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid user ID", data: null });
  }

  if (updateData.password) {
    const hashedPassword = await bcrypt.hash(updateData.password, 10);
    updateData.password = hashedPassword;
  }
  updateData.updated_at = Date.now();

  const user = await userModel.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found.",
    });
  }

  res.status(200).json({
    status: true,
    data: user,
    message: "Updated successfully",
  });
});

export const ChangePassword = catchAsync(async (req, res) => {
  const userId = req.query.id;
  const { confirm_password, new_password } = req.body;
  const saltRounds = 10;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid user ID.", data: null });
  }
  const user = await userModel.findById(userId);
  if (!user) {
    return res
      .status(404)
      .json({ status: false, message: "User not found", data: null });
  }

  if (!new_password || !confirm_password) {
    return res.status(400).json({
      status: false,
      data: null,
      message: "Confirm Password and New Password both required.",
    });
  }

  if (confirm_password !== new_password) {
    return res.status(400).json({
      status: false,
      data: null,
      message: "Confirm password is not same as New password.",
    });
  }

  const hashedPassword = await bcrypt.hash(new_password, saltRounds);
  user.password = hashedPassword;
  const updatedUser = await user.save();
  return res.status(200).json({
    status: true,
    data: updatedUser,
    message: "Password updated successfully",
  });
});

export const GetUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const {
    sortField = "user_id",
    sortOrder = "desc",
    search,
    id,
    role,
  } = req.query;

  if (id) {
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      status: true,
      data: user,
      message: "Fetched successfully",
    });
  }

  const sort = {};
  if (sortField) {
    sort[sortField] = sortOrder === "asc" ? 1 : -1;
  } else {
    sort["created_at"] = -1;
  }

  // Initialize searchQuery
  let searchQuery = { deleted_at: null };

  if (search) {
    const searchParts = search
      .split(" ")
      .map((part) => new RegExp(".*" + part + ".*", "i"));

    if (searchParts.length === 1) {
      const searchRegex = searchParts[0];
      searchQuery = {
        ...searchQuery,
        $or: [
          { first_name: searchRegex },
          { last_name: searchRegex },
          { email_id: searchRegex },
          { mobile_no: searchRegex },
          { role: searchRegex },
          { "assigned_room.room_no": searchRegex },
          ...(isNaN(parseInt(search)) ? [] : [{ user_id: parseInt(search) }]),
        ],
      };
    } else {
      const searchRegex1 = search
        ? new RegExp(".*" + search + ".*", "i")
        : null;
      searchQuery = {
        ...searchQuery,

        $or: [
          { "assigned_room.room_no": searchRegex1 },
          ...(isNaN(parseInt(search)) ? [] : [{ user_id: parseInt(search) }]),
          {
            $and: [
              { first_name: searchParts[0] },
              { last_name: searchParts[1] },
            ],
          },
          {
            $and: [
              { first_name: searchParts[1] },
              { last_name: searchParts[0] },
            ],
          },
        ],
      };
    }
  }

  // Filter functionality

  const filter = {};

  if (role && role !== "null") {
    filter["role"] = role;
  }

  // Fetching users with aggregation pipeline
  const users = await userModel.aggregate([
    {
      $lookup: {
        from: "rooms",
        localField: "assigned_room",
        foreignField: "_id",
        as: "assigned_room",
      },
    },
    { $unwind: { path: "$assigned_room", preserveNullAndEmptyArrays: true } },
    { $match: { ...searchQuery, ...filter } },
    { $sort: sort },
    { $skip: skip },
    { $limit: limit },
  ]);
  const totalDocuments = await userModel.aggregate([
    {
      $lookup: {
        from: "rooms",
        localField: "assigned_room",
        foreignField: "_id",
        as: "assigned_room",
      },
    },
    { $match: { ...searchQuery, ...filter } },
    { $count: "total" },
  ]);

  // const totalDocuments = await userModel.countDocuments({
  //   ...searchQuery,
  //   ...filter,
  // });

  return res.status(200).json({
    status: true,
    data: users,
    message: "Fetched successfully",
    totalPages: totalDocuments[0]?.total ? totalDocuments[0]?.total : 0,
  });
});
