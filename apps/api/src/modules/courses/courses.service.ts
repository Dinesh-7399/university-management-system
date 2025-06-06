import { CourseStatus } from '@synergylearn/db';
import * as repository from './courses.repository.js';
import type { CreateCourseInput, UpdateCourseInput } from './courses.dto.js';

export async function getPublishedCourses() { return repository.findPublishedCourses(); }
export async function createNewCourse(data: CreateCourseInput, userId: string) { return repository.createCourse(data, userId); }

export async function getSingleCourse(slug: string, user?: { id: string; role: string }) {
  const course = await repository.findCourseBySlug(slug);
  if (!course) return null;
  if (course.status === CourseStatus.PUBLISHED) return course;
  if (!user) return 'FORBIDDEN';
  const isAdmin = user.role === 'ADMIN' || user.role === 'SYS_ADMIN';
  const isCreator = course.creatorId === user.id;
  if (isAdmin || isCreator) return course;
  return 'FORBIDDEN';
}

export async function updateCourse(slug: string, data: UpdateCourseInput, user: { id: string; role: string }) {
  const course = await repository.findCourseBySlug(slug);
  if (!course) return null;
  const isAdmin = user.role === 'ADMIN' || user.role === 'SYS_ADMIN';
  const isCreator = course.creatorId === user.id;
  if (!isAdmin && !isCreator) return 'FORBIDDEN';
  return repository.updateCourseBySlug(slug, data);
}

export async function deleteCourse(slug: string, user: { id: string; role: string }) {
  const course = await repository.findCourseBySlug(slug);
  if (!course) return null;
  const isAdmin = user.role === 'ADMIN' || user.role === 'SYS_ADMIN';
  const isCreator = course.creatorId === user.id;
  if (!isAdmin && !isCreator) return 'FORBIDDEN';
  return repository.deleteCourseBySlug(slug);
}
