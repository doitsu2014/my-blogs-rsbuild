import { z } from 'zod';

export const blogFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  previewContent: z.string().min(1, 'Preview content is required').max(500, 'Preview must be less than 500 characters'),
  content: z.string().min(1, 'Content is required'),
  thumbnailPaths: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  tagNames: z.array(z.string()).default([]),
  categoryId: z.string().min(1, 'Category is required'),
  rowVersion: z.number().default(0),
});

export type BlogFormData = z.infer<typeof blogFormSchema>;
