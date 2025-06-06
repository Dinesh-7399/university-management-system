import { prisma, ContentType } from '@synergylearn/db';

export async function createLesson(moduleId: string, title: string, contentType: ContentType) {
  const lastLesson = await prisma.lesson.findFirst({ where: { moduleId }, orderBy: { order: 'desc' } });
  const newOrder = lastLesson ? lastLesson.order + 1 : 1;
  
  // A lesson must always have an associated content block
  return prisma.lesson.create({
    data: {
      title, moduleId, order: newOrder, contentType,
      content: { create: { type: contentType } }
    },
    include: { content: true } // Return the new content block ID
  });
}
