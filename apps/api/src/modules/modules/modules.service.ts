import * as repo from './modules.repository.js';
import { prisma } from '@synergylearn/db';

async function verifyCourseOwnership(courseId: string, user: { id: string; role: string }) {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { creatorId: true },
    });
    if (!course) return 'NOT_FOUND';
    return course.creatorId === user.id || user.role === 'ADMIN' || user.role === 'SYS_ADMIN';
}

async function verifyModuleOwnership(moduleId: string, user: { id: string; role: string }) {
    const module = await prisma.module.findUnique({
        where: { id: moduleId },
        select: { course: { select: { creatorId: true } } },
    });
    if (!module) return 'NOT_FOUND';
    const isCreator = module.course.creatorId === user.id;
    const isAdmin = user.role === 'ADMIN' || user.role === 'SYS_ADMIN';
    return isCreator || isAdmin;
}

export async function getCourseModules(courseId: string, user: { id: string; role: string }) {
    const hasPermission = await verifyCourseOwnership(courseId, user);
    if (!hasPermission) return hasPermission === 'NOT_FOUND' ? 'NOT_FOUND' : 'FORBIDDEN';
    return repo.findModulesByCourseId(courseId);
}

export async function createModule(courseId: string, title: string, user: { id:string; role: string }) {
    const hasPermission = await verifyCourseOwnership(courseId, user);
    if (!hasPermission) return hasPermission === 'NOT_FOUND' ? 'NOT_FOUND' : 'FORBIDDEN';
    return repo.createModuleForCourse(courseId, title);
}

export async function updateModuleDetails(moduleId: string, data: { title?: string }, user: { id: string; role: string }) {
    const hasPermission = await verifyModuleOwnership(moduleId, user);
    if (!hasPermission) return hasPermission === 'NOT_FOUND' ? 'NOT_FOUND' : 'FORBIDDEN';
    return repo.updateModule(moduleId, data);
}

export async function deleteModuleAndContent(moduleId: string, user: { id: string; role: string }) {
    const hasPermission = await verifyModuleOwnership(moduleId, user);
    if (!hasPermission) return hasPermission === 'NOT_FOUND' ? 'NOT_FOUND' : 'FORBIDDEN';
    return repo.deleteModule(moduleId);
}
