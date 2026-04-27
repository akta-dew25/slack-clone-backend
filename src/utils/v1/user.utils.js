import connectDB from "../../config/db.js";
import User from "../../models/user.model.js";

// Generate random password
const generateRandomPassword = () => {
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
    const { name, email, role } = data;

    // Generate random password
    const password = generateRandomPassword();

    const user = await User.create({
      name,
      email,
      password,
      // organizationId,
      role: role || { name: "user", permission: {} },
    });
    return {
      statusCode: 201,
      user,
      message: "User Created Successfully",
      // password, // Return password to be sent to user (should be via email)
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Internal Server Error",
      errors: [error?.message?.replaceAll('"')],
    };
  }
};

export const getUserUtils = async (data) => {
  try {
    const users = await User.find({ isActive: true })
      .select("-password")
      .populate("organizationId", "name");
    return {
      statusCode: 200,
      message: "Data fetch successfully",
      users,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Internal Server error",
      errors: [error?.message?.replaceAll('"')],
    };
  }
};
