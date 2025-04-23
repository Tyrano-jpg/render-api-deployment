import jwt from "jsonwebtoken";
import ApiError from "../Utils/ApiError.js";
import userModel from "../database/schema/user.schema.js";

const vendorAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.token;

    if (!token) {
      return next(new ApiError("Token not provided.", 401));
    }
    const vendorId = jwt.verify(token, process.env.JWT_SECRET);
    if (!vendorId) return next(new ApiError("Invalid token.", 400));

    const vendor = await userModel.findById({ _id: vendorId.id });

    if (!vendor) {
      return next(new ApiError("User Not Found.", 404));
    }

    if (vendor.status == false || vendor.deleted_at !== null) {
      return next(
        new ApiError(
          "Your account has been suspended. Please contact admin.",
          403
        )
      );
    }
    if (vendor.role !== "Mobile") {
      return next(new ApiError("Invalid Credentials.", 403));
    }
    req.user = vendor;
    next();
  } catch (error) {
    return next(error);
  }
};

export default vendorAuthMiddleware;
