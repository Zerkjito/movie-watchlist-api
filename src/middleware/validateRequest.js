import { ENV } from '../constants/env.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { createHttpError } from '../utils/errors.js';

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

      const message = ENV.IS_PRODUCTION ? 'Invalid input data' : flatErrors.join(', ');

      throw createHttpError(message, 400, ERROR_CODES.INVALID_INPUT);
    }

    req.body = result.data;
    next();
  };
};
