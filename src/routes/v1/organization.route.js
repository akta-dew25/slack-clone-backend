import express from "express";
import createOrgController from "../../controllers/v1/organization.controller.js";
import { validatePayload } from "../../middleware/validator.js";
import { orgUserValidation } from "../../utils/v1/validator.json.js";

const orgRouter = express.Router();

orgRouter.post(
  "/register",
  validatePayload({ rule: orgUserValidation }),
  createOrgController,
);

export default orgRouter;
