import express from "express";
import userRouter from "./user.route.js";
import authRouter from "./auth.route.js";
import { authorizeUser } from "../../middleware/auth.js";

const routerV1 = express.Router();

// routerV1.use("/organization", orgRouter);
routerV1.use("/user", userRouter, authorizeUser);
routerV1.use("/auth", authRouter);

export default routerV1;
