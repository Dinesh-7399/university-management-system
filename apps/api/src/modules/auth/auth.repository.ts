import { prisma, type UserRole } from '@synergylearn/db';

/**
 * Finds a user by their email address from the database.
 * This is the only place in the auth module that should query the User table for this purpose.
 *
 * @param email - The email of the user to find.
 * @returns The full user object (including hashed password) or null if not found.
 */
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Creates a new user record in the database.
 * This function encapsulates the `prisma.user.create` call.
 *
 * @param userData - The complete data needed to create a new user and their profile.
 * @returns The newly created user object, selecting only safe-to-return fields.
 */
export async function createUser(userData: {
  email: string;
  hashedPassword: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}) {
  return prisma.user.create({
    data: {
      email: userData.email,
      hashedPassword: userData.hashedPassword,
      role: userData.role,
      profile: {
        create: {
          firstName: userData.firstName,
          lastName: userData.lastName,
        },
      },
    },
    // Select only the fields that are safe to return to the service layer.
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}
