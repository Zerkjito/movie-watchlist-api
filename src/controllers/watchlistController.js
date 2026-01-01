import { prisma } from '../config/db.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { createHttpError } from '../utils/errors.js';
import { sendJSONResponse } from '../utils/response.js';

export const addToWatchlist = async (req, res) => {
  const { movieId, status, rating, notes } = req.body;

  //  Verify movie
  const movie = await prisma.movie.findUnique({ where: { id: movieId } });

  if (!movie) {
    throw new createHttpError('Movie not found', 404, ERROR_CODES.MOVIE_NOT_FOUND);
  }

  //   Verify dupes
  const alreadyInWatchlist = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
  });

  if (alreadyInWatchlist) {
    throw createHttpError(
      'Movie already in watchlist',
      409,
      ERROR_CODES.MOVIE_ALREADY_IN_WATCHLIST
    );
  }

  const watchlistItem = await prisma.watchlistItem.create({
    data: {
      userId: req.user.id,
      movieId,
      status: status,
      rating,
      notes,
    },
  });

  sendJSONResponse(res, { watchlistItem }, 201);
};

export const removeFromWatchlist = async (req, res) => {
  const watchlistItem = await prisma.watchlistItem.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  });

  if (!watchlistItem) {
    throw createHttpError('Watchlist item not found', 404, ERROR_CODES.WATCHLIST_ITEM_NOT_FOUND);
  }

  await prisma.watchlistItem.delete({ where: { id: watchlistItem.id } });
  sendJSONResponse(res, null, 204);
};

export const updateWatchlistItem = async (req, res) => {
  const { status, rating, notes } = req.body;
  const watchlistItem = await prisma.watchlistItem.findFirst({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  });

  if (!watchlistItem) {
    throw createHttpError('Watchlist item not found', 404, ERROR_CODES.WATCHLIST_ITEM_NOT_FOUND);
  }

  const updateData = Object.fromEntries(
    Object.entries({ status, rating, notes }).filter(([_, v]) => v !== undefined)
  );

  const updatedWatchlistItem = await prisma.watchlistItem.update({
    where: { id: watchlistItem.id },
    data: updateData,
  });

  sendJSONResponse(res, { watchlistItem: updatedWatchlistItem }, 200);
};
