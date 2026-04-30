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
      orgId: { type: "string" },
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

export const adduserValidation = {
  orgId: { type: "string" },
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
    type: "string",
    // mandatory: true,
    // regex:
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },
};
