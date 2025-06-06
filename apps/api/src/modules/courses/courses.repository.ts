import { prisma, CourseStatus, type Course } from '@synergylearn/db';
import type { CreateCourseInput, UpdateCourseInput } from './courses.dto.js';
import slugify from 'slugify';

export async function findPublishedCourses() {
  return prisma.course.findMany({ where: { status: CourseStatus.PUBLISHED }, orderBy: { createdAt: "desc" }, select: { id: true, title: true, slug: true, shortDescription: true, price: true, thumbnailUrl: true } });
}
export async function createCourse(data: CreateCourseInput, creatorId: string) {
  return prisma.course.create({ data: { ...data, slug: slugify(data.title, { lower: true, strict: true }), creator: { connect: { userId: creatorId } }, } });
}
export async function findCourseBySlug(slug: string): Promise<Course | null> {
  return prisma.course.findUnique({ where: { slug } });
}
// --- BUG FIX ---
// The slug should be permanent. We no longer update it, even if the title changes.
export async function updateCourseBySlug(slug: string, data: UpdateCourseInput): Promise<Course> {
  return prisma.course.update({ where: { slug }, data: data });
}
export async function deleteCourseBySlug(slug:string): Promise<Course> {
  return prisma.course.delete({ where: { slug } });
}
