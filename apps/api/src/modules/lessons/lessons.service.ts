import { prisma, ContentType } from '@synergylearn/db';
import * as lessonsRepo from './lessons.repository.js';

async function verifyModuleOwnership(moduleId: string, user: { id: string; role: string }) {
  const module = await prisma.module.findUnique({ where: { id: moduleId }, select: { course: { select: { creatorId: true } } } });
  if (!module) return 'NOT_FOUND';
  return module.course.creatorId === user.id || user.role === 'ADMIN' || user.role === 'SYS_ADMIN';
}
export async function createNewLesson(moduleId: string, title: string, contentType: ContentType, user: { id: string; role: string }) {
  const hasPermission = await verifyModuleOwnership(moduleId, user);
  if (!hasPermission) return hasPermission === 'NOT_FOUND' ? 'NOT_FOUND' : 'FORBIDDEN';
  return lessonsRepo.createLesson(moduleId, title, contentType);
}
