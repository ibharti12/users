import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import { createServer } from "http";
import logger from "./utils/logger.js";
import userRouter from "./modules/users/user.routes.js";
import { errorHandler } from "./utils/responseHandler.js";
import HttpStatus from "./constants/http_status.js";

const app = express();

var response = null;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use(cors());
app.use((req, res, next) => {
  response = res;
  next();
});

app.use("/users", userRouter);

app.get("/", (req, res) =>
  res.status(200).json({ success: true, message: "welcome to users" })
);

const httpServer = new createServer(app);

process.on("uncaughtException", (error) => {
  logger.fatal(error);

  if (!response || response.headersSent) return;

  let errorMessage = error.errors?.at(0)?.message || error.message;

  return errorHandler(response, HttpStatus.INTERNAL_SERVER_ERROR, errorMessage);
});

process.on("unhandledRejection", (error) => {
  logger.error(error);

  if (!response || response.headersSent) return;

  let errorMessage = error.errors?.at(0)?.message || error.message;

  return errorHandler(response, HttpStatus.INTERNAL_SERVER_ERROR, errorMessage);
});
const port = process.env.PORT;

httpServer.listen(
  port,
  logger.info(`Server is listening to requests on port: ${port}`)
);
