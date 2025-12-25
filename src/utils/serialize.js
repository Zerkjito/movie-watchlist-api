export const serializeUser = (user, includeName = true) => {
  const payload = {
    id: user.id,
    email: user.email,
  };

  if (includeName) payload.name = user.name;

  return payload;
};
