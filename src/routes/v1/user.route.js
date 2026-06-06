import express from "express";
import {
  createUserController,
  deleteUserController,
  getUserByIdController,
  getUserController,
  updateUserController,
  getUsersByIdsController,
} from "../../controllers/v1/user.controller.js";
import { adduserValidation } from "../../utils/v1/validator.json.js";
import { validatePayload } from "../../middleware/validator.js";
import { checkPermission } from "../../middleware/checkPermission.js";

const userRouter = express.Router();

userRouter.post(
  "/",
  checkPermission("user:create"),
  validatePayload({ rule: adduserValidation }),
  createUserController,
);

userRouter.get("/", getUserController);
userRouter.post("/userdetails", getUsersByIdsController);
userRouter.get("/:id", getUserByIdController);
userRouter.put("/:id", checkPermission("user:update"), updateUserController);

userRouter.delete("/:id", checkPermission("user:delete"), deleteUserController);

export default userRouter;
