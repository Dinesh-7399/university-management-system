import { Router } from 'express';
import { updateModuleHandler, deleteModuleHandler } from './modules.controller.js';
import { createLessonHandler } from '../lessons/lessons.controller.js';
import { isAuthenticated } from '../../middleware/isAuthenticated.js';
import { validate } from '../../middleware/validateRequest.js';
import { updateModuleDto, moduleParamsDto } from './modules.dto.js';
import { createLessonDto } from '../lessons/lessons.dto.js';

const modulesRouter = Router();

// Routes for specific module actions
modulesRouter.route('/:moduleId')
    .patch(isAuthenticated, validate(updateModuleDto), updateModuleHandler)
    .delete(isAuthenticated, validate(moduleParamsDto), deleteModuleHandler);
    
// Nested route for creating lessons within a module
modulesRouter.route('/:moduleId/lessons')
    .post(isAuthenticated, validate(createLessonDto), createLessonHandler);
    
export { modulesRouter };
