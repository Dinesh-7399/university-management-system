import { type Request, type Response, type NextFunction } from 'express';
import * as service from './modules.service.js';

// GET /api/v1/courses/:courseId/modules
export async function getModulesForCourseHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await service.getCourseModules(req.params.courseId, req.user!);
        if (result === 'NOT_FOUND') return res.status(404).json({ status: 'fail', message: 'Course not found' });
        if (result === 'FORBIDDEN') return res.status(403).json({ status: 'fail', message: 'You cannot access these modules' });
        return res.status(200).json({ status: 'success', data: { modules: result } });
    } catch (err) { next(err); }
}

// POST /api/v1/courses/:courseId/modules
export async function createModuleHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await service.createModule(req.params.courseId, req.body.title, req.user!);
        if (result === 'NOT_FOUND') return res.status(404).json({ status: 'fail', message: 'Course not found' });
        if (result === 'FORBIDDEN') return res.status(403).json({ status: 'fail', message: 'You cannot add modules to this course' });
        return res.status(201).json({ status: 'success', data: { module: result } });
    } catch (err) { next(err); }
}

// PATCH /api/v1/modules/:moduleId
export async function updateModuleHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const { moduleId } = req.params;
        const result = await service.updateModuleDetails(moduleId, req.body, req.user!);
        if (result === 'NOT_FOUND') return res.status(404).json({ status: 'fail', message: 'Module not found.' });
        if (result === 'FORBIDDEN') return res.status(403).json({ status: 'fail', message: 'You cannot edit this module.' });
        return res.status(200).json({ status: 'success', data: { module: result } });
    } catch (err) { next(err); }
}

// DELETE /api/v1/modules/:moduleId
export async function deleteModuleHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const { moduleId } = req.params;
        const result = await service.deleteModuleAndContent(moduleId, req.user!);
        if (result === 'NOT_FOUND') return res.status(404).json({ status: 'fail', message: 'Module not found.' });
        if (result === 'FORBIDDEN') return res.status(403).json({ status: 'fail', message: 'You cannot delete this module.' });
        return res.status(204).send();
    } catch (err) { next(err); }
}
