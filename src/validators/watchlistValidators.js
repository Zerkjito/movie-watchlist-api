import { z } from 'zod';

export const addToWatchlistSchema = z.object({
  movieId: z.string().uuid(),
  status: z
    .enum(['PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED'], {
      error: () => ({
        message: 'Status must be one of: PLANNED, WATCHING, COMPLETED, DROPPED',
      }),
    })
    .optional(),
  rating: z.coerce
    .number()
    .int('Rating must be an integer')
    .min(0, 'Number must be between 0 and 10')
    .max(10, 'Number must be between 0 and 10')
    .optional(),
  notes: z.string().min(1, 'Notes cannot be empty').optional(),
});
