import express from "express";
import orgRouter from "./organization.route.js";
import userRouter from "./user.route.js";
import authRouter from "./auth.route.js";

const routerV1 = express.Router();

routerV1.use("/organization", orgRouter);
routerV1.use("/user", userRouter);
routerV1.use("/auth", authRouter);

export default routerV1;
