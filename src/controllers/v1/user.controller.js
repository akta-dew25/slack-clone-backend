import { createUserUtils, getUserUtils } from "../../utils/v1/user.utils.js";

export const createUserController = async (req, res) => {
  try {
    const { statusCode, ...response } = await createUserUtils(req.body);
    res.status(statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: [error.message.replaceAll('"')],
    });
  }
};

export const getUserController = async (req, res) => {
  try {
    const { statusCode, ...response } = await createUserUtils(req);
    res.status(statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: [error.message.replaceAll('"')],
    });
  }
};
