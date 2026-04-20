import connectDB from "../../config/db.js";
import User from "../../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "./token.js";

const loginUtils = async (data) => {
  try {
    await connectDB();
    const { email, password } = data;

    // findone. = first object condition,second object same ,

    const user = await User.findOne(
      { email },
      { _id: 1, organizationId: 1, password: 1 },
    );
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
    const accessToken = generateAccessToken(
      { userId: user._id, orgId: user.organizationId },
      process.env.ACCESS_TOKEN_SECRET,
      "1h",
    );
    const refreshToken = generateRefreshToken(
      { userId: user._id, orgId: user.organizationId },
      process.env.REFRESH_TOKEN_SECRET,
      "7d",
    );
    // save refresh token in db
    user.refreshToken = refreshToken;
    await user.save();

    //  user login

    return {
      statusCode: 200,
      message: "Login successful",
      data: {
        userId: user._id,
        orgId: user.organizationId,
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

export default loginUtils;
