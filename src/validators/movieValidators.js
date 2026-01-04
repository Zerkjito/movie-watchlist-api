import { z } from 'zod';

const movieBaseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty')
    .max(100, 'Title cannot exceed 100 characters'),

  releaseYear: z.coerce
    .number()
    .int('Release year must be an integer')
    .min(1, 'Invalid release year')
    .max(9999, 'Invalid release year'),

  overview: z
    .string()
    .trim()
    .min(1, 'Overview cannot be empty')
    .max(2000, 'Overview cannot exceed 2000 characters')
    .optional(),

  runtime: z.coerce
    .number()
    .int('Runtime must be an integer')
    .min(1, 'Runtime must be between 1 and 1000 minutes')
    .max(1000, 'Runtime must be between 1 and 1000 minutes')
    .optional(),

  posterUrl: z.url().optional(),
  genres: z.array(z.string().trim()).max(5, 'Cannot have more than 5 genres').optional(),
});

export const addMovieSchema = movieBaseSchema.partial({
  overview: true,
  runtime: true,
  posterUrl: true,
  genres: true,
});

export const updateMovieSchema = movieBaseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, { error: 'At least one field must be provided' });

export const movieIdSchema = z.object({
  id: z.uuid('Invalid movie ID'),
});
