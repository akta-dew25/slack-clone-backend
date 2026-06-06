import {
  authRegisterUtils,
  loginUtils,
  forgotPasswordUtils,
  changePasswordUtils,
} from "../../utils/v1/auth.utils.js";

export const authRegisterController = async (req, res) => {
  try {
    const { statusCode, ...response } = await authRegisterUtils(req.body);
    res.status(statusCode).json(response);
  } catch (error) {
    console.log({ error });

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
    console.log({ error });

    res.status(500).json({
      message: "Internal Server Error",
      error: [error.message.replaceAll('"')],
    });
  }
};

export const authForgotPasswordController = async (req, res) => {
  try {
    const { statusCode, ...response } = await forgotPasswordUtils(req.body);
    res.status(statusCode).json(response);
  } catch (error) {
    console.log({ error });

    res.status(500).json({
      message: "Internal Server Error",
      error: [error.message.replaceAll('"')],
    });
  }
};

export const authChangePasswordController = async (req, res) => {
  try {
    const { statusCode, ...response } = await changePasswordUtils(req.body);
    res.status(statusCode).json(response);
  } catch (error) {
    console.log({ error });

    res.status(500).json({
      message: "Internal Server Error",
      error: [error.message.replaceAll('"')],
    });
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const { statusCode, ...response } = await refreshTokenUtils(req.body);
    res.status(statusCode).json(response);
  } catch (error) {
    console.log({ error });

    res.status(500).json({
      message: "Internal Server Error",
      error: [error.message.replaceAll('"')],
    });
  }
};
