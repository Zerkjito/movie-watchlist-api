export const sendJSONResponse = (res, data, status = 200) => {
  if (status === 204) {
    return res.status(204).end();
  }

  res.status(status).json({
    status: 'success',
    data,
  });
};

export const sendJSONError = (res, message, status = 400, code = null) => {
  const payload = { status: 'error', message };
  if (code) payload.code = code;
  res.status(status).json(payload);
};
