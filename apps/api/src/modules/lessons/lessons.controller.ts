import { type Request, type Response, type NextFunction } from 'express';
import { createNewLesson } from './lessons.service.js';

export async function createLessonHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const { moduleId } = req.params;
        const { title, contentType } = req.body;
        const result = await createNewLesson(moduleId, title, contentType, req.user!);
        if (result === 'NOT_FOUND') return res.status(404).json({ status: 'fail', message: 'Module not found' });
        if (result === 'FORBIDDEN') return res.status(403).json({ status: 'fail', message: 'You cannot add lessons to this module' });
        res.status(201).json({ status: 'success', data: { lesson: result } });
    } catch(err) { next(err); }
}
