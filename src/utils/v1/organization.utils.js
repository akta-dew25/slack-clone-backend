import connectDB from "../../config/db.js";
import Organization from "../../models/organization.model.js";
import createUserUtils from "./user.utils.js";

const createOrgUtils = async (data) => {
  try {
    await connectDB();

    const {
      org: { name, domain, logo },
      user,
    } = data;

    //  const userId = data.req?.user?.id || data.req?.body?.userId|| 12345

    const existingOrg = await Organization.findOne({ domain });
    if (existingOrg) {
      return {
        statusCode: 400,
        message: "Domain already exists",
      };
    }
    const org = await Organization.create({
      name,
      domain,
      logo,
    });

    if (org?._id) {
      const {
        statusCode,
        message,
        errors,
        user: _user,
      } = await createUserUtils({
        ...user,
        organizationId: org?._id,
      });
      if (statusCode === 201) {
        return {
          statusCode: 201,
          message: "Organization and User created successfully",
          org,
          user: _user,
        };
      } else {
        return {
          statusCode: statusCode,
          message: "Organization created but failed to create user",
          errors,
          org,
        };
      }
    } else {
      return {
        statusCode: 500,
        message: "Internal Server Error",
        error: "Failed to create organization",
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: "Internal Server Error",
      errors: [error?.message?.replaceAll('"')],
    };
  }
};

export default createOrgUtils;
