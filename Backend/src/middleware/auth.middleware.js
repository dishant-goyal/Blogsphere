import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import User from "../models/user.model.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  // 1️⃣ Get token from cookies
  const token = req.cookies?.token;
  
  if (!token) {
    throw new ApiError(401, "Not authorized, token missing"); 
  }

  try {
    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Attach user to request (excluding password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new ApiError(401, "User not found, invalid token");
    }

    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, "Not authorized, invalid or expired token");
  }
});

