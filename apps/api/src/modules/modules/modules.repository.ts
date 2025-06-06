import { prisma } from '@synergylearn/db';

export async function findModuleById(moduleId: string) {
    return prisma.module.findUnique({ where: { id: moduleId } });
}

export async function findModulesByCourseId(courseId: string) {
    return prisma.module.findMany({
        where: { courseId },
        orderBy: { order: 'asc' }
    });
}

export async function createModuleForCourse(courseId: string, title: string) {
    const lastModule = await prisma.module.findFirst({
        where: { courseId },
        orderBy: { order: 'desc' },
    });
    const newOrder = lastModule ? lastModule.order + 1 : 1;
    return prisma.module.create({
        data: { title, courseId, order: newOrder }
    });
}

export async function updateModule(moduleId: string, data: { title?: string; order?: number }) {
    return prisma.module.update({ where: { id: moduleId }, data });
}

export async function deleteModule(moduleId: string) {
    return prisma.module.delete({ where: { id: moduleId } });
}
