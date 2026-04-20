import jwt from "jsonwebtoken";

export const generateAccessToken = (payload, tokenSecret, expiresIn = "1h") => {
  return jwt.sign(payload, tokenSecret, { expiresIn });
};

export const generateRefreshToken = (
  payload,
  tokenSecret,
  expiresIn = "7d",
) => {
  return jwt.sign(payload, tokenSecret, { expiresIn });
};
