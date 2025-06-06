// We modify the existing courses routes to handle nested module routes.
import { Router } from 'express';
import * as controller from './courses.controller.js';
import { isAuthenticated } from '../../middleware/isAuthenticated.js';
import { checkPermissions } from '../../middleware/checkPermissions.js';
import { validate } from '../../middleware/validateRequest.js';
import { createCourseDto, updateCourseDto, courseParamsDto } from './courses.dto.js';
import { makeOptionalAuth } from '../../middleware/makeOptionalAuth.js';
import { createModuleHandler, getModulesForCourseHandler } from '../modules/modules.controller.js';
import { createModuleDto, getModulesDto } from '../modules/modules.dto.js';

const coursesRouter = Router();

coursesRouter.route('/')
  .get(controller.getAllPublishedCoursesHandler)
  .post(isAuthenticated, checkPermissions(['INSTRUCTOR', 'ADMIN', 'SYS_ADMIN']), validate(createCourseDto), controller.createCourseHandler);

// Route for all modules within a specific course
// e.g., /api/v1/courses/course123/modules
coursesRouter.route('/:courseId/modules')
  .get(isAuthenticated, validate(getModulesDto), getModulesForCourseHandler)
  .post(isAuthenticated, checkPermissions(['INSTRUCTOR', 'ADMIN', 'SYS_ADMIN']), validate(createModuleDto), createModuleHandler);


coursesRouter.route('/:slug')
  .get(makeOptionalAuth, validate(courseParamsDto), controller.getCourseBySlugHandler)
  .patch(isAuthenticated, validate(updateCourseDto), controller.updateCourseHandler)
  .delete(isAuthenticated, validate(courseParamsDto), controller.deleteCourseHandler);

export { coursesRouter };
