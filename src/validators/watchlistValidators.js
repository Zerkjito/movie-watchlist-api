import { z } from 'zod';

const watchlistBaseSchema = z.object({
  status: z.enum(['PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED'], {
    error: () => ({
      message: 'Status must be one of: PLANNED, WATCHING, COMPLETED, DROPPED',
    }),
  }),
  rating: z.coerce
    .number()
    .int('Rating must be an integer')
    .min(0, 'Number must be between 0 and 10')
    .max(10, 'Number must be between 0 and 10'),
  notes: z.string().trim().min(1, 'Notes cannot be empty').max(1000, 'Notes cannot exceed 1000 characters'),
});

export const addToWatchlistSchema = watchlistBaseSchema
  .extend({
    movieId: z.string().uuid(),
  })
  .partial({
    status: true,
    rating: true,
    notes: true,
  });

export const updateWatchlistSchema = watchlistBaseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, { error: 'At least one field must be provided' });
