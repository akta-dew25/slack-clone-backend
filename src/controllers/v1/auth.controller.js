import {
  authRegisterUtils,
  loginUtils,
  forgotPasswordUtils,
  changePasswordUtils,
  refreshTokenUtils,
} from "../../utils/v1/auth.utils.js";

export const authRegisterController = async (req, res) => {
  try {
    // add uploaded logo into org object
    const logo = req.file ? `${req.file.filename}` : null;

    const { statusCode, ...response } = await authRegisterUtils({
      org: {
        ...req.body.org,
        logo,
      },
      user: req.body.user,
    });
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
