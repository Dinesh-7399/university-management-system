import { z } from 'zod';

export const registerUserDto = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('A valid email is required'),
    password: z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters long'),
    firstName: z.string({ required_error: 'First name is required' }).min(2, 'First name is required'),
    lastName: z.string({ required_error: 'Last name is required' }).min(2, 'Last name is required'),
  }),
});
// Create a TypeScript type from the schema
export type RegisterUserInput = z.infer<typeof registerUserDto>['body'];


export const loginUserDto = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('A valid email is required'),
    password: z.string({ required_error: 'Password is required' }),
  }),
});
export type LoginUserInput = z.infer<typeof loginUserDto>['body'];
