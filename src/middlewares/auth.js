import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/responseHandler.js";
import HttpStatus from "../constants/http_status.js";
import responses from "../constants/responses.js";
import { findUser } from "../modules/users/user.service.js";

export const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token,"tokk-")

  if (!token) return errorHandler(res, HttpStatus.UNAUTHORIZED, responses.UNAUTHORIZED);

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
console.log(decodedToken,"decodedToken")
  const user = await findUser({ id: decodedToken.user_id });
  if (!user) return errorHandler(res, HttpStatus.UNAUTHORIZED, responses.INVALID_USER);
console.log(user,"user")
  

  req.user = decodedToken;

  next();
};

