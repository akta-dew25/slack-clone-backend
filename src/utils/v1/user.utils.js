import axios from "axios";
import connectDB from "../../config/db.js";
import User from "../../models/user.model.js";
import { deleteCache, getCache, redisKeys, setCache } from "./cache.js";
import { ROLES } from "../../constants/roles.js";

// Generate random password
export const generateRandomPassword = () => {
  const length = 12;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return password;
};

export const createUserUtils = async (data) => {
  try {
    await connectDB();

    const user = await User.create({ ...data, role: data.role || ROLES.USER });
    await deleteCache(redisKeys.orgUsers(user.orgId));
    const notify = await axios.post(
      "http://localhost:9000/api/v1/notifications/send-invite",
      {
        name: user.name,
        email: user.email,
        password: data.password,
        organization: "DevCrew",
      },
    );

    return {
      statusCode: 201,
      user: {
        name: user.name,
        email: user.email,
        // role: user.role,
        isActive: user.isActive,
        userId: user._id,

        Joined: user.createdAt,
      },
      emailMsg: notify.data.message,

      message: "User Created Successfully",
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

export const getOrgUsersUtils = async (
  orgId,
  userIds,
  search = null,
  // isActive = true,
  page = 1,
  limit = 10,
) => {
  try {
    await connectDB();
    const cacheKey = redisKeys.orgUsers(orgId);
    const cachedUsers = await getCache(cacheKey);
    if (cachedUsers) {
      return {
        statusCode: 200,
        message: "Users fetched from cache",
        users: cachedUsers,
      };
    }
    const users = await User.find({ orgId });

    const formattedUsers = users.map((user) => ({
      name: user.name,
      userId: user._id,
      orgId: user.orgId,
      email: user.email,
      role: user.role.name || user.role,
      isActive: user.isActive,
      Joined: user.createdAt,
    }));

    await setCache(cacheKey, formattedUsers, 300);

    return {
      statusCode: 200,
      message: "Data fetch successfully",
      users: formattedUsers,
    };
  } catch (error) {
    console.log({ error });
    return {
      statusCode: 500,
      message: "Internal Server error",
      errors: [error?.message?.replaceAll('"')],
    };
  }
};

export const getOrgUserById = async (id) => {
  try {
    await connectDB();
    const cacheKey = redisKeys.userById(id);
    const cachedUser = await getCache(cacheKey);

    if (cachedUser) {
      return {
        statusCode: 200,
        user: cachedUser,
      };
    }
    const user = await User.findById(id);
    if (!user) {
      return {
        statusCode: 404,
        message: "User not found",
      };
    }
    const userData = {
      name: user.name,
      userId: user._id,
      orgid: user.orgId,
      email: user.email,
      role: user.role.name,
      isActive: user.isActive,
      Joined: user.createdAt,
    };

    await setCache(cacheKey, userData, 300);

    return {
      statusCode: 200,
      message: "User fetch successfully",
      user: userData,
    };
  } catch (error) {
    console.log({ error });
    return {
      statusCode: 500,
      message: "Internal Server error",
      errors: [error?.message?.replaceAll('"')],
    };
  }
};

export const updateUserbyId = async ({ id, updates }) => {
  try {
    await connectDB();

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    await deleteCache(redisKeys.userById(id));
    await deleteCache(redisKeys.orgUsers(user.orgId));

    if (!user) {
      return {
        statusCode: 404,
        message: "User not found",
      };
    }

    return {
      statusCode: 200,
      message: "User updated Successfully",
      user: {
        name: user.name,
        userId: user._id,
        orgid: user.orgId,
        email: user.email,
        role: user.role.name,
        isActive: user.isActive,
        Joined: user.createdAt,
      },
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

export const getUsersByIds = async (orgId, userIds) => {
  try {
    await connectDB();

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return {
        statusCode: 400,
        message: "Invalid userIds array",
      };
    }
    const cacheKey = redisKeys.usersByIds(orgId, userIds);
    const cachedUsers = await getCache(cacheKey);

    if (cachedUsers) {
      return {
        statusCode: 200,
        message: "Users fetched successfully",
        users: cachedUsers,
      };
    }

    const users = await User.find({
      _id: { $in: userIds },
      orgId: orgId,
    });

    if (users.length === 0) {
      return {
        statusCode: 404,
        message: "No users found",
        users: [],
      };
    }

    const formattedUsers = users.map((user) => ({
      name: user.name,
      userId: user._id,
      orgId: user.orgId,
      email: user.email,
      role: user.role.name,
      isActive: user.isActive,
      Joined: user.createdAt,
    }));
    await setCache(cacheKey, formattedUsers, 300);

    return {
      statusCode: 200,
      message: "Users fetched successfully",
      users: formattedUsers,
    };
  } catch (error) {
    console.log({ error });
    return {
      statusCode: 500,
      message: "Internal Server error",
      errors: [error?.message?.replaceAll('"')],
    };
  }
};

export const deleteUserbyId = async (id) => {
  try {
    await connectDB();
    const user = await User.findByIdAndDelete(id);

    if (user) {
      await deleteCache(redisKeys.userById(id));
      await deleteCache(redisKeys.orgUsers(user.orgId));
    }
    if (!user) {
      return { statusCode: 404, message: "User not found" };
    }
    return {
      statusCode: 200,
      message: "User deleted successfully",
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
