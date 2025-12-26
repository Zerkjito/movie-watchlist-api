import { prisma } from '../config/db.js';
import { sendJSONError, sendJSONResponse } from '../utils/response.js';

export const addToWatchlist = async (req, res) => {
  const { movieId, status, rating, notes } = req.body;

  //  Verify movie
  const movie = await prisma.movie.findUnique({ where: { id: movieId } });

  if (!movie) {
    return sendJSONError(res, 'Movie not found', 404, 'MOVIE_NOT_FOUND');
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
    return sendJSONError(res, 'Movie already in watchlist', 409, 'MOVIE_ALREADY_IN_WATCHLIST');
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
    return sendJSONError(res, 'Watchlist item not found', 404, 'WATCHLIST_ITEM_NOT_FOUND');
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
    return sendJSONError(res, 'Watchlist item not found', 404, 'WATCHLIST_ITEM_NOT_FOUND');
  }

  const updateData = {};

  if (status !== undefined) updateData.status = status;
  if (rating !== undefined) updateData.rating = rating;
  if (notes !== undefined) updateData.notes = notes;

  if (Object.keys(updateData).length === 0) {
    return sendJSONError(res, 'No data provided to update', 400, 'EMPTY_UPDATE_DATA');
  }

  await prisma.watchlistItem.update({
    where: { id: watchlistItem.id },
    data: updateData,
  });

  sendJSONResponse(res, null, 204);
};
