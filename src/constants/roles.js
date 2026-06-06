import { PERMISSIONS } from "./permission.js";

export const ROLES = {
  ADMIN: {
    name: "Admin",
    permissions: "*",
  },

  USER: {
    name: "User",
    permissions: [
      PERMISSIONS.GROUP_CREATE,
      PERMISSIONS.GROUP_ADD_MEMBER,
      PERMISSIONS.GROUP_REMOVE_MEMBER,
      PERMISSIONS.PERSONAL_CHAT_CREATE,
    ],
  },
};
