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
      },
      email: {
        mandatory: true,
        type: "email",
        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      },
      password: {
        type: "string",
        min: 6,
        max: 10,
        regex:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      },
    },
  },
};
