import HttpStatus from "../constants/http_status.js";
import { requiredFields } from "../constants/validationConstants.js";
import { errorHandler } from "../utils/responseHandler.js";

/*
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next middleware function
 */
const fieldValidator = (req, res, next) => {
  let url = req.originalUrl.split("/").at(-1); 
  let body = JSON.parse(JSON.stringify(req.body)); 

  if (url.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
    url = req.url.split("/").at(-2); 
  }

  const reqdFields = requiredFields[url] || []; // Get required fields for the URL
  let error;

  for (const field of reqdFields) {
    if (body[field] == "" || typeof body[field] == "undefined" || typeof body[field] == "null") {
      error = `${field} cannot be empty`;
      break;
   
    }
  }
  if (error) return errorHandler(res, HttpStatus.BAD_REQUEST, error);

  

  next(); 
};

export default fieldValidator;
