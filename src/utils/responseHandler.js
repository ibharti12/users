export const successHandler = (res, status, message, data, metaData) =>
  res.status(200).json({ success: true, status, message, data, metaData });

export const errorHandler = (res, status, message, data) =>
  res.status(status == 500 || 401 ? status : 200).json({ success: false, status, message, data });
