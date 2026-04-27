import express from "express";
import {
  createUserController,
  getUserController,
} from "../../controllers/v1/user.controller.js";
import { authJwtToken, authorize } from "../../middleware/auth.js";
import { adduserValidation } from "../../utils/v1/validator.json.js";
import { validatePayload } from "../../middleware/validator.js";

const userRouter = express.Router();

userRouter.post(
  "/",
  authJwtToken,
  validatePayload({ rule: adduserValidation }),
  createUserController,
);

userRouter.get("/", authJwtToken, getUserController);

export default userRouter;
