import {
  createUserUtils,
  deleteUserbyId,
  generateRandomPassword,
  getOrgUserById,
  getOrgUsersUtils,
  updateUserbyId,
} from "../../utils/v1/user.utils.js";

export const createUserController = async (req, res) => {
  try {
    const password = generateRandomPassword();
    const { statusCode, ...response } = await createUserUtils({
      ...req.body,
      password,
      role: { name: "user", permission: {} },
      orgId: req.user.orgId,
    });
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
    const { statusCode, ...response } = await getOrgUsersUtils(req.user.orgId);
    res.status(statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: [error.message.replaceAll('"')],
    });
  }
};

export const getUserByIdController = async (req, res) => {
  try {
    const { statusCode, ...response } = await getOrgUserById(req.params.id);
    res.status(statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: [error.message.replaceAll('"')],
    });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { statusCode, ...response } = await updateUserbyId({
      id: req.params.id,
      updates: req.body,
    });
    res.status(statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: [error.message.replaceAll('"')],
    });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const { statusCode, ...response } = await deleteUserbyId(req.params.id);
    res.status(statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: [error.message.replaceAll('"')],
    });
  }
};
