import axios from "axios";
import connectDB from "../../config/db.js";
import User from "../../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "./token.js";
import { createUserUtils } from "./user.utils.js";

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
      { _id: 1, orgId: 1, password: 1, role: 1 },
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
      { userId: user._id, orgId: user.orgId, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      "1h",
    );
    const refreshToken = generateRefreshToken(
      { userId: user._id, orgId: user.orgId, role: user.role },
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
        orgId: user.orgId,
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
