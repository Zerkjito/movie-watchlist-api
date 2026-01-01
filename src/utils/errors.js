// ideally, a custom class should be used e.g AppError, but for this project it would be overkill
export const createHttpError = (message, status = 500, code = 'INTERNAL_ERROR') => {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
};
