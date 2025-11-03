import { asyncHandler } from "../utils/asyncHandler.js";

import {ApiError} from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";



export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};

  
  if (!name || !email || !password) {
    res
    .status(400)
    .send(new ApiResponse(400,{},"All fields are required"))
    throw new ApiError(400, "All fields are required");
  }

  
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.send(new ApiResponse(401,{},"user already exists"))
    throw new ApiError(400, "User already exists with this email");
    
  }


  const user = await User.create({ name, email, password });

  
  const sanitizedUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };

  
  return res
    .status(201)
    .json(new ApiResponse(201, sanitizedUser, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    res
    .status(400)
    .send(new ApiResponse(400,{},"All fields are required"))
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.send(new ApiResponse(404,{},"User not found"))
    throw new ApiError(404, "User not found");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.send(new ApiResponse(404,{},"Invalid credentials"))
    throw new ApiError(401, "Invalid credentials");
  }

  const tokenPayload = { id: user._id, email: user.email };
  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  
  const sanitizedUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };

  
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: sanitizedUser, token },
        "Logged in successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

