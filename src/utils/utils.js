import jwt from "jsonwebtoken";

export const genToken = (data, secret, duration) => {
  const token = jwt.sign(data, secret, duration ? { expiresIn: duration } : null);
  return encodeURIComponent(token);
};


