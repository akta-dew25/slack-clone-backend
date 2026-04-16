import createOrgUtils from "../../utils/v1/organization.utils.js";
import createUserUtils from "../../utils/v1/user.utils.js";

const createOrgController = async (req, res) => {
  try {
    const { statusCode, ...response } = await createOrgUtils(req.body);

    res.status(statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: [error.message.replaceAll('"')],
    });
  }
};

export default createOrgController;
