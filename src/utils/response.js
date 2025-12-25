export const sendJSONResponse = (res, data, status = 200) => {
  res.status(status).json({
    status: 'success',
    data,
  });
};

export const sendJSONError = (res, message, status = 400) => {
  res.status(status).json({
    status: 'error',
    message,
  });
};
