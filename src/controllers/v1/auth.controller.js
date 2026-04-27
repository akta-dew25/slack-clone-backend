import { authRegisterUtils, loginUtils } from "../../utils/v1/auth.utils.js";

export const authRegisterController = async (req, res) => {
  try {
    const { statusCode, ...response } = await authRegisterUtils(req.body);
    res.status(statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: [error.message.replaceAll('"')],
    });
  }
};

export const authLoginController = async (req, res) => {
  try {
    const { statusCode, ...response } = await loginUtils(req.body);
    res.status(statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: [error.message.replaceAll('"')],
    });
  }
};
