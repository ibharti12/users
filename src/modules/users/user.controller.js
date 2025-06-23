import bcrypt from "bcrypt";
import { successHandler, errorHandler } from "../../utils/responseHandler.js";
import HttpStatus from "../../constants/http_status.js";
import { genToken } from "../../utils/utils.js";
import responses from "../../constants/responses.js";
import {
  findUser,
  updateUser,
  createUser,
  totalUser,
  findAllUser,
} from "./user.service.js";
import { sendMail } from "../../utils/mail.helper.js";
import jwt from "jsonwebtoken";
import { googleLoginDetails, sendEmail } from "./user.helper.js";
export const login = async (req, res) => {
  let { email, password, role } = req.body;

  email = email.toLowerCase();

  const user = await findUser({ email });
  if (!user) {
    return errorHandler(res, HttpStatus.BAD_REQUEST, responses.USER_NOT_FOUND);
  }

  if (role == 1 && user.is_verified === false) {
    return errorHandler(
      res,
      HttpStatus.BAD_REQUEST,
      responses.VERIFIED_PENDING
    );
  }

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) {
    return errorHandler(res, HttpStatus.BAD_REQUEST, responses.WRONG_PASS);
  }

  const token = genToken({ user_id: user.id }, process.env.ACCESS_TOKEN, "7d");

  const response = {
    token,
    user,
  };

  return successHandler(res, HttpStatus.OK, responses.LOGGED_IN, response);
};

export const getUser = async (req, res) => {
  let { page, limit, search } = req.query;
  const { user_id } = req.user;

  // console.log(user_id)

  if (search) {
    search = decodeURIComponent(search).replace(/'/g, "''");
  }

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 15;

  const users = await findAllUser({ page, limit, search, role: "1", user_id });

  const totalUsers = await totalUser({ search, role: "1", user_id });
  const totalPages = Math.ceil(totalUsers / limit);

  const pagination = {
    limit,
    previous_page: page - 1 <= 0 ? null : page - 1,
    current_page: page,
    next_page: page + 1 <= totalPages ? page + 1 : null,
    total_page: totalPages,
    total_records: totalUsers,
  };

  return successHandler(
    res,
    HttpStatus.OK,
    responses.EMPLOYEE_ACCOUNT_FETCHED,
    users,
    pagination
  );
};
export const register = async (req, res) => {
  let data = req.body;

  const existingUser = await findUser({ email: data.email });

  if (existingUser) {
    if (existingUser?.is_verified) {
      return errorHandler(res, HttpStatus.CONFLICT, responses.ACCOUNT_EXISTS);
    }
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    await updateUser({ password: data.password }, { id: existingUser?.id });

    await sendEmail({
      id: existingUser?.id,
      email: existingUser?.email,
      name: existingUser?.name,
      type: "verify",
    });
    successHandler(res, HttpStatus.OK, responses.PLEASE_VERIFY_EMAIL);
  }
  if (data.password) data.password = await bcrypt.hash(data.password, 10);

  let createdUser = await createUser(data);
  await sendEmail({
    id: createdUser?.id,
    email: createdUser?.email,
    name: createdUser?.name,
    type: "verify",
  });

  successHandler(res, HttpStatus.OK, responses.PLEASE_VERIFY_EMAIL);
};
export const emailVerify = async (req, res) => {
  const { token } = req.params;
  if (!token)
    return errorHandler(res, HttpStatus.BAD_REQUEST, responses.TOKEN_NOT_FOUND);

  let verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN);

  await updateUser({ is_verified: true }, { id: verifyToken?.user_id });

  successHandler(res, HttpStatus.OK, responses.EMAIL_VERIFIED);
};

export const goggleLogin = async (req, res) => {
  const data = req.body;
  console.log(data, "token");
  const getUserDeatils = await googleLoginDetails(data);

  let createdUser = await createUser(getUserDeatils);
  let token = await genToken(
    { user_id: createdUser.id },
    process.env.ACCESS_TOKEN,
    "1h"
  );
  successHandler(res, HttpStatus.OK, responses.GOOGLE_LOGIN, token);
};
export const userDetails = async (req, res) => {
  const { user_id } = req.user;

  const getUser = await findUser({ id: user_id });
  if (!getUser)
    return errorHandler(res, HttpStatus.BAD_REQUEST, responses.USER_NOT_FOUND);

  successHandler(res, HttpStatus.OK, responses.USER_DETAILS_FETCHED, getUser);
};

export const forgotPassword = async (req, res) => {
  let { email } = req.body;
  email = email.toLowerCase();

  const user = await findUser({ email });
  if (!user)
    return errorHandler(res, HttpStatus.BAD_REQUEST, responses.USER_NOT_FOUND);

  await sendEmail({
    id: user?.id,
    email: user?.email,
    name: user?.name,
    type: "reset",
  });

  successHandler(res, HttpStatus.OK, responses.EMAIL_SENT);
};

export const updatePass = async (req, res) => {
  const { password, token } = req.body;
  const { user_id } = req.user;

  const user = await findUser({ id: user_id });

  const encryptedPass = await bcrypt.hash(password, 10);
  await updateUser({ password: encryptedPass }, { email: user.email });

  successHandler(res, HttpStatus.OK, responses.PASSWORD_UPDATED);
};

export const changePass = async (req, res) => {
  const { old_password, new_password } = req.body;
  const { user_id } = req.user;

  const user = await findUser({ id: user_id });

  const checkPass = await bcrypt.compare(old_password, user.password);
  if (!checkPass)
    return errorHandler(res, HttpStatus.BAD_REQUEST, responses.WRONG_PASS);

  const encryptedPass = await bcrypt.hash(new_password, 10);
  await updateUser({ password: encryptedPass }, { id: user_id });

  successHandler(res, HttpStatus.OK, responses.PASSWORD_UPDATED);
};

export const updateUserDetails = async (req, res) => {
  const { user_id } = req.user;
  let data = req.body;

  let isUser = await findUser({ id: user_id, is_deleted: false });
  if (!isUser)
    return errorHandler(res, HttpStatus.UNAUTHORIZED, responses.INVALID_USER);

  if (data.email) data.email = data.email.toLowerCase();

  if (req.file?.location) data.profile_pic = req.file?.location;
  else if (data.remove_profile == "true") data.profile_pic = "";

  if (data.email && data.email != isUser.email) {
    const checkEmail = await findUser({
      email: data.email,
      is_deleted: false,
      role: data.role,
    });
    if (checkEmail)
      return errorHandler(
        res,
        HttpStatus.BAD_REQUEST,
        responses.ACCOUNT_EXISTS
      );

    const { otp } = await sendMail(
      data.email,
      "OTP verification",
      "sendOtp",
      isUser
    );

    const checkOtp = await findOtp({ email: data.email });
    if (checkOtp) await updateOtpDetails({ otp }, { email: data.email });
    else await saveOtp({ email: data.email, otp });
  }
  // if (data.profile_pic && isUser.profile_pic) await deleteMediaFromBucket(isUser.profile_pic);

  await updateUser(data, { id: user_id });

  const user = JSON.parse(
    JSON.stringify(await findUser({ id: user_id, is_deleted: false }))
  );

  delete user.password;
  delete user.token;

  successHandler(res, HttpStatus.OK, responses.USER_UPDATED, user);
};
