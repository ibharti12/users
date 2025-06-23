import { auth } from "../../middlewares/auth.js";
import upload from "../../middlewares/upload.js";
import fieldValidator from "../../middlewares/validator.js";
import {
  changePass,
  emailVerify,
  forgotPassword,
  getUser,
  goggleLogin,
  login,
  register,
  updatePass,
  userDetails,
} from "./user.controller.js";
import { Router } from "express";
const userRouter = Router();

userRouter.post("/login", fieldValidator, login);

userRouter.post("/register", upload.single("file"), fieldValidator, register);

userRouter.get("/verify/:token", emailVerify);

userRouter.post("/google-login", goggleLogin);

userRouter.get("/", auth, userDetails);

userRouter.get("/get-user", auth, getUser);

userRouter.post("/forgot-password", fieldValidator, forgotPassword);

userRouter.post("/update-password", auth, fieldValidator, updatePass);

userRouter.post("/change-password", auth, fieldValidator, changePass);

export default userRouter;
