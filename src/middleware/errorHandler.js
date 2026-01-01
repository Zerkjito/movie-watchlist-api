import { Prisma } from '@prisma/client';
import { sendJSONError } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'INTERNAL_ERROR';

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    status = 400;
    code = code.error;
    message = `Database error: ${err.message}`;
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    status = 400;
    code = 'PRSIMA_VALIDATION_ERROR';
    message = `Validation error: ${err.message}`;
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    status = 500;
    code = 'PRISMA_UNKNOWN_ERROR';
    message = `Unknown database error: ${err.message}`;
  }

  sendJSONError(res, message, status, code);
};
