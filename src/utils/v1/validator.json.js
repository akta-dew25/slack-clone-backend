export const orgUserValidation = {
  org: {
    mandatory: true,
    type: "object",
    allowEmptyObject: false,
    objectAttr: {
      name: { mandatory: true, type: "string" },
      domain: {
        mandatory: true,
        type: "url",
      },
      logo: {
        type: "string",
      },
    },
  },
  user: {
    mandatory: true,
    type: "object",
    allowEmptyObject: false,
    objectAttr: {
      organizationId: { type: "string" },
      name: {
        mandatory: true,
        type: "string",
        // min: 3,
      },
      email: {
        mandatory: true,
        type: "email",
      },
      password: {
        regex:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      },
    },
  },
};
export const userLoginValidation = {
  email: {
    mandatory: true,
    type: "email",
  },
  password: {
    mandatory: true,
  },
};
