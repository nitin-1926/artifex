'use server';

import { hash } from 'bcryptjs';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { signUpSchema } from '~/schemas';
import { signIn, signOut } from '~/server/auth';
import { db } from '~/server/db';

const logout = async () => {
	await signOut({ redirect: true });
};

const register = async (prevState: string | undefined, formData: FormData) => {
	try {
		const firstName = formData.get('firstName');
		const lastName = formData.get('lastName');
		const email = formData.get('email');
		const password = formData.get('password');

		const result = await signUpSchema.parseAsync({ firstName, lastName, email, password });
		const name = `${result.firstName} ${result.lastName}`;

		const user = await db.user.findUnique({
			where: {
				email: result.email,
			},
		});

		if (user) {
			return 'User already exists';
		}

		const hashedPassword = await hash(result.password, 10);

		await db.user.create({
			data: {
				name,
				email: result.email,
				password: hashedPassword,
			},
		});

		return 'success';
	} catch (error) {
		if (error instanceof z.ZodError) {
			return error.errors.map(err => err.message).join(', ');
		}
		return 'Email or password is invalid';
	}
};

const login = async (prevState: string | undefined, formData: FormData) => {
	try {
		await signIn('credentials', formData);
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return 'Invalid credentials';
				default:
					return 'Something went wrong';
			}
		}
		throw error;
	}
};

export { login, logout, register };
