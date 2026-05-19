import connectDB from "../../config/db.js";
import User from "../../models/user.model.js";

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

    const user = await User.create(data);

    return {
      statusCode: 201,
      user: {
        name: user.name,
        email: user.email,
      },
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
    const users = await User.find({ orgId });
    return {
      statusCode: 200,
      message: "Data fetch successfully",
      users: users.map((user) => {
        return {
          name: user.name,
          userId: user._id,
          orgId: user.orgId,
          email: user.email,
        };
      }),
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
    const user = await User.findById(id);
    if (!user) {
      return {
        statusCode: 404,
        message: "User not found",
      };
    }
    return {
      statusCode: 200,
      message: "User fetch successfully",
      user: {
        name: user.name,
        userId: user._id,
        orgid: user.orgId,
        email: user.email,
      },
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

    return {
      statusCode: 200,
      message: "Users fetched successfully",
      users: users.map((user) => {
        return {
          name: user.name,
          userId: user._id,
          orgId: user.orgId,
          email: user.email,
        };
      }),
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
