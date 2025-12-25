import { prisma } from '../config/db.js';
import { sendJSONError, sendJSONResponse } from '../utils/response.js';

export const addToWatchlistController = async (req, res) => {
  const { movieId, status, rating, notes, userId } = req.body;

  //  Verify movie
  const movie = await prisma.movie.findUnique({ where: { id: movieId } });

  if (!movie) {
    return sendJSONError(res, 'Movie not found', 404, 'NOT_FOUND');
  }

  //   Verify dupes
  const alreadyInWatchlist = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: userId,
        movieId: movieId,
      },
    },
  });

  if (alreadyInWatchlist) {
    return sendJSONError(res, 'Movie already in watchlist', 400, 'ALREADY_IN_WATCHLIST');
  }

  const watchlistItem = await prisma.watchlistItem.create({
    data: {
      userId,
      movieId,
      status: status,
      rating,
      notes,
    },
  });

  sendJSONResponse(res, { watchlistItem }, 201);
};
