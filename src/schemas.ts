import { z } from 'zod';

export const signUpSchema = z.object({
	firstName: z.string({ required_error: 'First name is required' }),
	lastName: z.string({ required_error: 'Last name is required' }),
	email: z.string({ required_error: 'Email is required' }).email('Invalid email'),
	password: z
		.string({ required_error: 'Password is required' })
		.min(8, 'Password must be at least 8 characters')
		.max(32, 'Password must be at most 32 characters'),
});

export const signInSchema = z.object({
	email: z.string({ required_error: 'Email is required' }).email('Invalid email'),
	password: z.string({ required_error: 'Password is required' }),
});
