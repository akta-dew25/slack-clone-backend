import authUtils from "../../utils/v1/auth.utils.js";

const authController = async (req, res) => {
  try {
    const { statusCode, ...response } = await authUtils(req.body);
    res.status(statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: [error.message.replaceAll('"')],
    });
  }
};

export default authController;
