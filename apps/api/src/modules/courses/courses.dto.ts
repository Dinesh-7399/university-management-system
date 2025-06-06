import { z } from 'zod';
export const createCourseDto = z.object({ body: z.object({ title: z.string({ required_error: 'Title is required' }).min(3), shortDescription: z.string().optional(), price: z.number().nonnegative().default(0), }), });
export type CreateCourseInput = z.infer<typeof createCourseDto>['body'];
export const updateCourseDto = z.object({ body: z.object({ title: z.string().min(3).optional(), shortDescription: z.string().optional(), longDescription: z.string().optional(), thumbnailUrl: z.string().url().optional(), price: z.number().nonnegative().optional(), status: z.enum(['DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'ARCHIVED']).optional(), }), params: z.object({ slug: z.string({ required_error: 'Course slug is required' }), }), });
export type UpdateCourseInput = z.infer<typeof updateCourseDto>['body'];
export const courseParamsDto = z.object({ params: z.object({ slug: z.string(), }), });
