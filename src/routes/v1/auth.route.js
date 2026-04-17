import express from "express";
import { validatePayload } from "../../middleware/validator.js";
import { userLoginValidation } from "../../utils/v1/validator.json.js";
import authController from "../../controllers/v1/auth.controller.js";

const authRouter = express.Router();

authRouter.post(
  "/user/login",
  validatePayload({ rule: userLoginValidation }),
  authController,
);

export default authRouter;
