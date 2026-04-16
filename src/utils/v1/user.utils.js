import connectDB from "../../config/db.js";
import Organization from "../../models/organization.model.js";
import User from "../../models/user.model.js";

const createUserUtils = async (data) => {
  try {
    await connectDB();

    const user = await User.create(data);
    return {
      statusCode: 201,
      user,
      message: "User Created Successfully",
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Internal Server Error",
      errors: [error?.message?.replaceAll('"')],
    };
  }
};

export default createUserUtils;
