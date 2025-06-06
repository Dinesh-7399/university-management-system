import { z } from 'zod';
export const moduleParamsDto = z.object({ params: z.object({ moduleId: z.string() }) });
export const updateModuleDto = z.object({
  body: z.object({ title: z.string().min(3).optional(), order: z.number().int().positive().optional() }),
  ...moduleParamsDto.shape,
});
export const createModuleDto = z.object({
  body: z.object({ title: z.string({ required_error: 'Title is required' }).min(3) }),
  params: z.object({ courseId: z.string({ required_error: 'courseId URL parameter is required' }) })
});
export const getModulesDto = z.object({ params: z.object({ courseId: z.string() }) });
