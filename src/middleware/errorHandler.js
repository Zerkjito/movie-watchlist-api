import { Prisma } from '@prisma/client';
import { sendJSONError } from '../utils/response.js';
import { ENV } from '../constants/env.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

export const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || ERROR_CODES.INTERNAL_ERROR;

  if (!ENV.IS_PRODUCTION) {
    console.error(err.stack);
  } else {
    console.error(err);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    status = 400;

    if (ENV.IS_PRODUCTION) {
      if (err.code === 'P2002') {
        message = 'Resource already exists';
        code = ERROR_CODES.DUPLICATE_RESOURCE;
      } else {
        message = 'Invalid request';
        code = ERROR_CODES.DATABASE_ERROR;
      }
    } else {
      code = ERROR_CODES.PRISMA_VALIDATION_ERROR;
      message = `Database error: ${err.message}`;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    status = 400;

    if (ENV.IS_PRODUCTION) {
      code = ERROR_CODES.INVALID_INPUT;
      message = 'Invalid request data';
    } else {
      code = ERROR_CODES.PRISMA_VALIDATION_ERROR;
      message = `Validation error: ${err.message}`;
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    status = 500;
    code = ERROR_CODES.PRISMA_UNKNOWN_ERROR;
    message = `Unknown database error`;
  }

  sendJSONError(res, message, status, code);
};
