import { ENV } from '../constants/env.js';

export const setCookie = (res, name, token, options = {}) => {
  res.cookie(name, token, {
    httpOnly: true,
    secure: ENV.IS_PRODUCTION,
    sameSite: 'strict',
    ...options,
  });
};

export const clearCookies = (res, name, options = {}) => {
  res.clearCookie(name, {
    httpOnly: true,
    secure: ENV.IS_PRODUCTION,
    sameSite: 'strict',
    path: '/',
    ...options,
  });
};
