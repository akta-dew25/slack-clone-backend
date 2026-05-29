import express from "express";
import { validatePayload } from "../../middleware/validator.js";
import {
  orgUserValidation,
  userLoginValidation,
  forgotPasswordValidation,
  changePasswordValidation,
} from "../../utils/v1/validator.json.js";
import {
  authLoginController,
  authRegisterController,
  authForgotPasswordController,
  authChangePasswordController,
  refreshTokenController,
} from "../../controllers/v1/auth.controller.js";

const authRouter = express.Router();

authRouter.post(
  "/login",
  validatePayload({ rule: userLoginValidation }),
  authLoginController,
);

authRouter.post(
  "/register",
  validatePayload({ rule: orgUserValidation }),
  authRegisterController,
);

authRouter.post(
  "/forgot-password",
  validatePayload({ rule: forgotPasswordValidation }),
  authForgotPasswordController,
);

authRouter.post(
  "/change-password",
  validatePayload({ rule: changePasswordValidation }),
  authChangePasswordController,
);

authRouter.post("/refresh-token", refreshTokenController);

export default authRouter;
