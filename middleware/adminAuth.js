import jwt from "jsonwebtoken";
import ApiError from "../Utils/ApiError.js";
import userModel from "../database/schema/user.schema.js";

const authMiddleware = async (req, res, next) => {
  try {
    // const token = req.cookies.token;
    const token = req.headers.token;
    if (!token) {
      return next(new ApiError("Token not provided.", 401));
    }
    const userId = jwt.verify(token, process.env.JWT_SECRET);
    // if (!userId) return next(new ApiError("Invalid token.", 400));
    if (!userId)
      return next(
        res
          .status(400)
          .json({ status: false, message: "Invalid token.", logout: true })
      );

    const user = await userModel.findById({ _id: userId.id });

    if (!user) {
      // return next(new ApiError("User Not Found.", 404));
      return next(
        res
          .status(400)
          .json({ status: false, message: "User Not Found.", logout: true })
      );
    }
    if (user.role !== "Admin") {
      // return next(new ApiError("You are not allowed to access this portal.", 401));
      return next(
        res.status(401).json({
          status: false,
          message: "You are not allowed to access this portal.",
          logout: true,
        })
      );
    }

    if (user.status == false || user.deleted_at !== null) {
      // return next(new ApiError("Your account has been suspended. Please contact admin.", 403));
      return next(
        res.status(403).json({
          status: false,
          message: "Your account has been suspended. Please contact admin.",
          logout: true,
        })
      );
    }
    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};

export default authMiddleware;
