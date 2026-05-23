import express from "express";
import { validatePayload } from "../../middleware/validator.js";
import {
  orgUserValidation,
  userLoginValidation,
  forgotPasswordValidation,
} from "../../utils/v1/validator.json.js";
import {
  authLoginController,
  authRegisterController,
  authForgotPasswordController,
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

export default authRouter;
