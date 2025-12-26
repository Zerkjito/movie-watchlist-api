import { sendJSONError } from '../utils/response.js';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formatted = result.error.format();

      const flatErrors = Object.values(formatted)
        .flat()
        .filter(Boolean)
        .map((err) => err._errors)
        .flat();

      return sendJSONError(res, flatErrors.join(', '), 400, 'VALIDATION_ERROR');
    }

    req.body = result.data;
    next();
  };
};
