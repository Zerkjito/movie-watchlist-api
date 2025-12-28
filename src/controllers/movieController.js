import { prisma } from '../config/db';
import { sendJSONError, sendJSONResponse } from '../utils/response';

export const addMovie = async (req, res) => {
  const { title, overview, releaseYear, genres, runtime, posterUrl } = req.body;

  const alreadyCreated = await prisma.movie.findFirst({
    where: {
      title,
      releaseYear,
      createdBy: req.user.id,
    },
  });

  if (alreadyCreated) {
    return sendJSONError(res, 'Movie already exists', 409, 'MOVIE_ALREADY_EXISTS');
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
  const { title, overview, releaseYear, genres, runtime, posterUrl } = req.body;
  const movie = await prisma.movie.findFirst({
    where: {
      id: req.params.id,
      createdBy: req.user.id,
    },
  });

  if (!movie) {
    return sendJSONError(res, 'Movie not found', 404, 'MOVIE_NOT_FOUND');
  }

  const updateData = Object.fromEntries(
    Object.entries({ title, overview, releaseYear, genres, runtime, posterUrl }).filter(([_, v]) => v !== undefined)
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
      id: req.params.id,
      createdBy: req.user.id,
    },
  });

  if (!movie) {
    return sendJSONError(res, 'Movie not found', 404, 'MOVIE_NOT_FOUND');
  }

  await prisma.movie.delete({ where: { id: movie.id } });
  sendJSONResponse(res, null, 204);
};
