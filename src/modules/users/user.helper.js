import { sendMail } from "../../utils/mail.helper.js";
import { genToken } from "../../utils/utils.js";
import axios from "axios";

export const sendEmail = async (data) => {
  const token = genToken({ user_id: data.id }, process.env.ACCESS_TOKEN, "10m");
  let subject;
  if (data.type == "verify") {
    data.token = `http://localhost:5173/email-verification/${token}`;
    subject = "Verify Email";
  } else {
    data.token = `http://localhost:5173/reset-password/${token}`;
    subject = "Reset Password";
  }
  await sendMail(data?.email, subject, data, data.type);
};

export const googleLoginDetails = async (data) => {
  try {
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${data?.token}`
    );

    return {
      email: response.data.email,
      name: response.data.name,
      picture: response.data.picture,
      client_id: response.data.sub,
      role: "1",
      is_verified: true,
    };
  } catch (error) {
    console.error(
      "Error validating Google token:",
      error.response?.data || error.message
    );
    throw error;
  }
};
