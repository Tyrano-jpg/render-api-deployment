import catchAsync from "../../Utils/catchAsync.js";
import bcrypt from "bcrypt";
// import sendEmail from "../../Utils/SendEmail.js";
import ApiError from "../../Utils/ApiError.js";
import userModel from "../../database/schema/user.schema.js";
// import { sendOtpEmail } from "../../Utils/SendEmail.js";
import applicationModel from "../../database/schema/candidate_application.schema.js";

const saltRounds = 10;

export const LoginVendor = catchAsync(async (req, res, next) => {
  const { email_id, password } = req.body;

  const user = await userModel.findOne({ email_id: email_id });
  if (!user) {
    return res
      .status(401)
      .json({ status: false, message: "User not found with this user Id." });
  }
  if (user.role !== "Mobile") {
    return res
      .status(401)
      .json({ status: false, message: "Access is denied." });
  }

  if (user.status == false || user.deleted_at !== null) {
    return next(
      new ApiError(
        "Your account has been suspended. Please contact admin.",
        403
      )
    );
  }
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res
      .status(401)
      .json({ message: "Invalid Password.", status: false });
  }

  const token = user.jwtToken(next);

  return res
    .status(200)
    .cookie("token", token)
    .cookie("userId", user.id)
    .json({
      status: true,
      data: {
        user: user,
        token: token,
      },
      message: "Login success.",
    });
});

export const SendOTP = catchAsync(async (req, res) => {
  const { email_id } = req.body;
  // let otp = Math.floor(Math.random() * 100000);
  var otp = Math.floor(100000 + Math.random() * 9000);
  const user = await userModel.findOne({ email_id: email_id, role: "Mobile" });
  if (!user) {
    return res.status(401).json({
      status: false,
      message: "User not found with this user Id or email id is invalid.",
    });
  }

  user.otp = otp;
  await user.save();
  sendOtpEmail(user?.email_id, `Your OTP is: ${otp}`, "Your OTP");

  return res.status(200).json({
    success: true,
    message: "OTP has been sent successfully on registered email.",
  });
});

export const VerifyOTPAndUpdatePassword = catchAsync(async (req, res) => {
  const { email_id, otp, password } = req.body;

  const user = await userModel.findOne({ email_id: email_id, role: "Mobile" });
  if (!user) {
    return res
      .status(401)
      .json({ status: false, message: "User not found with this email Id." });
  }

  if (!otp || otp !== user.otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  user.password = hashedPassword;
  user.otp = null;
  const updatedUser = await user.save();
  return res.status(200).json({
    status: true,
    data: updatedUser,
    message: "Password updated successfully.",
  });
});

export const UpdateProfile = catchAsync(async (req, res, next) => {
  var _id = req.user._id;

  if (req?.body?.user_id) {
    return next(new ApiError("Can't update User Id", 404));
  }

  var result = await userModel.findByIdAndUpdate(
    _id,
    {
      $set: { ...req.body, updated_at: Date.now() },
    },
    { new: true, useFindAndModify: false }
  );
  return res
    .status(200)
    .json({ status: true, data: result, message: "Profile has been updated." });
});

export const ResetPassword = catchAsync(async (req, res) => {
  var _id = req.user._id;

  const { old_password, new_password } = req.body;

  const oldPasswordMatch = await bcrypt.compare(
    old_password,
    req?.user?.password
  );
  if (!oldPasswordMatch) {
    return res
      .status(401)
      .json({ message: "Current password is incorrect.", status: false });
  }

  if (req.body.old_password == req.body.new_password) {
    return res.status(400).json({
      status: false,
      data: null,
      message: "This is already your current password.",
    });
  }
  const hash = await bcrypt.hash(new_password, saltRounds);
  var result = await userModel.findByIdAndUpdate(
    _id,
    {
      $set: {
        password: hash,
        updated_at: Date.now(),
      },
    },
    { new: true, useFindAndModify: false }
  );
  return res.status(200).json({
    status: true,
    data: result,
    message: "Password updated successfully.",
  });
});

// export const AddJobApplication = catchAsync(async (req, res) => {
//   const data = req.body;

//   // const latestGuest = await guestModel.find().sort({ guest_id: -1 }).limit(1);
//   // const latestGuestId = latestGuest.length > 0 ? latestGuest[0].guest_id : 0;
//   // data.guest_id = latestGuestId + 1;
//   // const newGuest = new guestModel(data);
//   // const savedGuest = await newGuest.save();
//   // sendEmailsForData([savedGuest]);
//   return res.status(201).json({
//     status: true,
//     data: savedGuest,
//     message: "Registered successfully. QR Code has been sent on email Id",
//   });
// });

export const AddJobApplication = catchAsync(async (req, res) => {
  var data = { ...req.body };

  const resumeFile = req.files?.resume_file;
  let resume_file;
  
  if (resumeFile && resumeFile?.length > 0 && resumeFile?.[0]) {
    resume_file = resumeFile?.[0];
    data.resume_file = resume_file;
  }

  const savedApplication = await applicationModel.create(data);

  return res.status(201).json({
    status: true,
    data: savedApplication,
    message: "Application submitted! Will reach out soon!",
  });
});
