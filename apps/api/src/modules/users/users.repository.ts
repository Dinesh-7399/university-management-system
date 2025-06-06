import { prisma } from '@synergylearn/db';

export async function findAllUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { // Only select necessary and safe fields
      id: true,
      email: true,
      role: true,
      isActive: true,
      isEmailVerified: true,
      createdAt: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
        }
      }
    }
  });
}
