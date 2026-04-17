import connectDB from "../../config/db.js";
import User from "../../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "./token.js";
import bcrypt from "bcryptjs";

const authUtils = async (data) => {
  try {
    await connectDB();
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) {
      return {
        statusCode: 400,
        message: "User not found",
      };
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return {
        statusCode: 400,
        message: "Invalid credentials",
      };
    }

    // generate token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    // save refresh token in db
    user.refreshToken = refreshToken;
    await user.save();

    //  user login

    return {
      statusCode: 200,
      message: "Login successful",
      data: {
        id: user._id,
        username: user.name,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Internal Server Error",
      errors: [error?.message?.replaceAll('"')],
    };
  }
};

export default authUtils;
