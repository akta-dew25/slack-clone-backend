import express from "express";
import { validatePayload } from "../../middleware/validator.js";
import {
  orgUserValidation,
  userLoginValidation,
} from "../../utils/v1/validator.json.js";
import {
  authLoginController,
  authRegisterController,
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

export default authRouter;
