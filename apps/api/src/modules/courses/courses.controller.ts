import { type Request, type Response, type NextFunction } from 'express';
import * as service from './courses.service.js';
import type { CreateCourseInput, UpdateCourseInput } from './courses.dto.js';

export async function getAllPublishedCoursesHandler(req: Request, res: Response, next: NextFunction) {
  try { res.status(200).json({ status: 'success', data: { courses: await service.getPublishedCourses() } }); }
  catch (err) { next(err); }
}

export async function createCourseHandler(req: Request<{}, {}, CreateCourseInput>, res: Response, next: NextFunction) {
  try {
    const newCourse = await service.createNewCourse(req.body, req.user!.id);
    res.status(201).json({ status: 'success', data: { course: newCourse } });
  } catch (err: any) {
    if (err.code === 'P2002') return res.status(409).json({ status: 'fail', message: 'A course with this title already exists.' });
    if (err.code === 'P2025') return res.status(400).json({ status: 'fail', message: 'Creator profile not found.' });
    next(err);
  }
}

export async function getCourseBySlugHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.getSingleCourse(req.params.slug, req.user);
    if (!result) return res.status(404).json({ status: 'fail', message: 'Course not found.' });
    if (result === 'FORBIDDEN') return res.status(403).json({ status: 'fail', message: 'You cannot view this course.' });
    res.status(200).json({ status: 'success', data: { course: result } });
  } catch (err) { next(err); }
}

export async function updateCourseHandler(req: Request<{slug: string}, {}, UpdateCourseInput>, res: Response, next: NextFunction) {
  try {
    const result = await service.updateCourse(req.params.slug, req.body, req.user!);
    if (!result) return res.status(404).json({ status: 'fail', message: 'Course not found.' });
    if (result === 'FORBIDDEN') return res.status(403).json({ status: 'fail', message: 'You cannot update this course.' });
    res.status(200).json({ status: 'success', data: { course: result }});
  } catch (err) { next(err); }
}

export async function deleteCourseHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.deleteCourse(req.params.slug, req.user!);
    if (!result) return res.status(404).json({ status: 'fail', message: 'Course not found.' });
    if (result === 'FORBIDDEN') return res.status(403).json({ status: 'fail', message: 'You cannot delete this course.' });
    res.status(204).send();
  } catch (err) { next(err); }
}
