import { prisma } from '../config/db.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { createHttpError } from '../utils/errors.js';
import { sendJSONResponse } from '../utils/response.js';

export const addMovie = async (req, res) => {
  const { title, overview, releaseYear, genres, runtime, posterUrl } = req.validatedBody;

  const alreadyCreated = await prisma.movie.findFirst({
    where: {
      title,
      releaseYear,
      createdBy: req.user.id,
    },
  });

  if (alreadyCreated) {
    throw createHttpError(res, 'Movie already created', 409, ERROR_CODES.MOVIE_ALREADY_CREATED);
  }

  const movie = await prisma.movie.create({
    data: {
      title,
      overview,
      releaseYear,
      genres,
      runtime,
      posterUrl,
      createdBy: req.user.id,
    },
  });

  sendJSONResponse(res, { movie }, 201);
};

export const updateMovie = async (req, res) => {
  const { title, overview, releaseYear, genres, runtime, posterUrl } = req.validatedBody;
  const movie = await prisma.movie.findFirst({
    where: {
      id: req.validatedParams.id,
      createdBy: req.user.id,
    },
  });

  if (!movie) {
    throw createHttpError('Movie not found', 404, ERROR_CODES.MOVIE_NOT_FOUND);
  }

  const updateData = Object.fromEntries(
    Object.entries({ title, overview, releaseYear, genres, runtime, posterUrl }).filter(
      ([_, v]) => v !== undefined
    )
  );

  const updatedMovie = await prisma.movie.update({
    where: { id: movie.id },
    data: updateData,
  });

  sendJSONResponse(res, { movie: updatedMovie }, 200);
};

export const removeMovie = async (req, res) => {
  const movie = await prisma.movie.findFirst({
    where: {
      id: req.validatedParams.id,
      createdBy: req.user.id,
    },
  });

  if (!movie) {
    throw createHttpError('Movie not found', 404, ERROR_CODES.MOVIE_NOT_FOUND);
  }

  await prisma.movie.delete({ where: { id: movie.id } });
  sendJSONResponse(res, null, 204);
};
