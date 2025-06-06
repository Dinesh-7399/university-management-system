import { UserRole } from '@synergylearn/db';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { type RegisterUserInput, type LoginUserInput } from './auth.dto.js';
// THE FIX: Use explicit named imports for clarity and correctness.
import { findUserByEmail, createUser } from './auth.repository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key_32_chars';
const SALT_ROUNDS = 12;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);


/** --- Standard JWT Auth --- */

export async function registerNewUser(input: RegisterUserInput) {
  const hashedPassword = await hash(input.password, SALT_ROUNDS);
  // THE FIX: Call the function directly without the prefix.
  const user = await createUser({
    email: input.email.toLowerCase(), hashedPassword, role: UserRole.STUDENT,
    firstName: input.firstName, lastName: input.lastName,
  });
  return user;
}

export async function loginUser(input: LoginUserInput) {
  // THE FIX: Call the function directly without the prefix.
  const user = await findUserByEmail(input.email.toLowerCase());
  if (!user || !user.hashedPassword || !(await compare(input.password, user.hashedPassword))) {
    throw new Error('Invalid email or password');
  }
  return signAppJwt(user.id, user.role);
}


/** --- Google OAuth Logic --- */

export async function verifyGoogleTokenAndLogin(token: string) {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('Google Client ID is not configured on the server.');
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error('Invalid Google token.');
  }
  if (!payload.email_verified) {
      throw new Error('Please verify your Google email address before signing in.');
  }

  // THE FIX: Call the function directly without the prefix.
  let user = await findUserByEmail(payload.email);

  if (!user) {
    // THE FIX: Call the function directly without the prefix.
    user = await createUser({
      email: payload.email,
      hashedPassword: await hash(`${Date.now()}-${payload.sub}`, SALT_ROUNDS),
      role: UserRole.STUDENT,
      firstName: payload.given_name || 'New',
      lastName: payload.family_name || 'User',
    });
  }

  return signAppJwt(user.id, user.role);
}


/** --- Helper Functions --- */

function signAppJwt(userId: string, role: UserRole) {
  const payload = { userId, role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}
