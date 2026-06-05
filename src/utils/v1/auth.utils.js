import axios from "axios";
import connectDB from "../../config/db.js";
import User from "../../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "./token.js";
import { createUserUtils } from "./user.utils.js";
import { redisKeys, setCache } from "./cache.js";

export const authRegisterUtils = async (data) => {
  try {
    const {
      org: { name, domain, logo },
      user,
    } = data;

    const { data: org } = await axios.post(
      "http://localhost:5000/api/v1/organization",
      {
        name,
        domain,
        logo,
      },
    );

    const organization = org.org;

    if (organization._id) {
      const {
        statusCode,
        message,
        errors,
        user: _user,
      } = await createUserUtils({
        ...user,
        role: { name: "Admin", permissions: "*" },
        orgId: organization._id,
        // isPasswordChanged: true,
        isActive: "Active",
      });

      if (statusCode === 201) {
        return {
          statusCode: 201,
          message: "Organization and User created successfully",
          org: organization,
          user: {
            name: _user.name,
            email: _user.email,
            orgId: _user.orgId,
            userId: _user._id,
          },
        };
      } else {
        return {
          statusCode: statusCode,
          message: "Organization created but failed to create user",
          errors,
          org,
        };
      }
    } else {
      return {
        statusCode: 500,
        message: "Internal Server Error",
        error: "Failed to create organization",
      };
    }
  } catch (error) {
    console.log({ error });
    return {
      statusCode: 500,
      message: "Internal Server Error",
      errors: [error.response.data.message, error?.message?.replaceAll('"')],
    };
  }
};

export const loginUtils = async (data) => {
  try {
    await connectDB();
    const { email, password } = data;

    // findone. = first object condition,second object same ,
    const user = await User.findOne(
      { email },
      { _id: 1, orgId: 1, password: 1, role: 1, name: 1, isActive: 1 },
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
      {
        userId: user._id,
        orgId: user.orgId,
        userName: user.name,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      "1h",
    );
    const refreshToken = generateRefreshToken(
      {
        userId: user._id,
        orgId: user.orgId,
        role: user.role,
        userName: user.name,
      },
      process.env.REFRESH_TOKEN_SECRET,
      "7d",
    );
    // save refresh token in db
    user.refreshToken = refreshToken;
    await setCache(
      redisKeys.refreshToken(user._id),
      refreshToken,
      7 * 24 * 60 * 60,
    );
    await user.save();

    //  user login

    return {
      statusCode: 200,
      message: "Login successful",
      data: {
        isActive: user.isActive,
        userId: user._id,
        orgId: user.orgId,
        name: user.name,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log({ error });
    return {
      statusCode: 500,
      message: "Internal Server Error",
      errors: [error?.message?.replaceAll('"')],
    };
  }
};

export const forgotPasswordUtils = async (data) => {
  try {
    await connectDB();
    const { email, password } = data;

    if (!email || !password) {
      return { statusCode: 400, message: "Email and password are required" };
    }

    const user = await User.findOne({ email });
    if (!user) {
      return { statusCode: 404, message: "User not found" };
    }

    user.password = password;
    await user.save();

    return {
      statusCode: 200,
      message: "Password updated successfully",
    };
  } catch (error) {
    console.log({ error });
    return {
      statusCode: 500,
      message: "Internal Server Error",
      errors: [error?.message?.replaceAll('"')],
    };
  }
};

export const changePasswordUtils = async ({
  userId,
  currentPassword,
  newPassword,
}) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return {
        statusCode: 404,
        message: "User not found",
      };
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return {
        statusCode: 400,
        message: "Current password is incorrect",
      };
    }

    user.password = newPassword;
    user.isActive = "Active";

    await user.save();
    console.log({ user });

    return {
      statusCode: 200,
      message: "Password updated successfully",
      user: {
        isActive: user.isActive,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message,
    };
  }
};

export const refreshTokenUtils = async ({ refreshToken }) => {
  try {
    if (!refreshToken) {
      return {
        statusCode: 401,
        message: "Refresh token required",
      };
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return {
        statusCode: 404,
        message: "User not found",
      };
    }
    const storedToken = await getCache(redisKeys.refreshToken(decoded.userId));

    if (!storedToken || storedToken !== refreshToken) {
      return {
        statusCode: 401,
        message: "Invalid refresh token",
      };
    }

    // NEW ACCESS TOKEN

    const accessToken = generateAccessToken(
      {
        userId: user._id,
        orgId: user.orgId,
        role: user.role,
        userName: user.name,
      },
      process.env.ACCESS_TOKEN_SECRET,
      "1h",
    );

    return {
      statusCode: 200,
      message: "Access token refreshed",
      accessToken,
    };
  } catch (error) {
    return {
      statusCode: 401,
      message: "Invalid refresh token",
    };
  }
};
