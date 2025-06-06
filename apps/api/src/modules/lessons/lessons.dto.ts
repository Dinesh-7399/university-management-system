import { z } from 'zod';
export const lessonParamsDto = z.object({ params: z.object({ lessonId: z.string() }) });
export const updateLessonDto = z.object({
    body: z.object({ title: z.string().min(3).optional() }),
    ...lessonParamsDto.shape,
});
export const createLessonDto = z.object({
    body: z.object({ title: z.string().min(3), contentType: z.enum(['VIDEO', 'RICH_TEXT', 'QUIZ', 'ASSIGNMENT', 'PDF_DOCUMENT', 'EXTERNAL_LINK']) }),
    params: z.object({ moduleId: z.string() }),
});
