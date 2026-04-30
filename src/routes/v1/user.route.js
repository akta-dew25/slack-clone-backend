import express from "express";
import {
  createUserController,
  deleteUserController,
  getUserByIdController,
  getUserController,
  updateUserController,
} from "../../controllers/v1/user.controller.js";
import { adduserValidation } from "../../utils/v1/validator.json.js";
import { validatePayload } from "../../middleware/validator.js";

const userRouter = express.Router();

userRouter.post(
  "/",
  validatePayload({ rule: adduserValidation }),
  createUserController,
);

userRouter.get("/", getUserController);
userRouter.get("/:id", getUserByIdController);
userRouter.patch("/:id", updateUserController);

userRouter.delete("/:id", deleteUserController);

export default userRouter;
