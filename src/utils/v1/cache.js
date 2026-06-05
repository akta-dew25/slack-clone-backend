// import { redisClient } from "../config/redis.js";

import { redisClient } from "../../config/redis.js";

export const authKeys = {
  userSession: (userId) => `auth:user:${userId}`,
  refreshToken: (userId) => `auth:refresh:${userId}`,
};

export const userKeys = {
  user: (userId) => `user:${userId}`,
  usersList: (page = 1) => `users:page:${page}`,
};

export const redisKeys = {
  refreshToken: (userId) => `auth:refresh:${userId}`,
  userById: (id) => `user:${id}`,
  orgUsers: (orgId) => `org:${orgId}:users`,
  usersByIds: (orgId, userIds) => `users:${orgId}:${userIds.sort().join(",")}`,
};

export const getCache = async (key) => {
  const data = await redisClient.get(key);

  return data ? JSON.parse(data) : null;
};

export const setCache = async (key, value, ttl = 600) => {
  await redisClient.set(key, JSON.stringify(value), "EX", ttl);
};

export const deleteCache = async (key) => {
  await redisClient.del(key);
};
