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
		const result = (await signIn('credentials', {
			...Object.fromEntries(formData),
			redirect: false,
		})) as { error?: string };

		if (result?.error) {
			return 'error';
		}

		return 'success';
	} catch (error) {
		console.log('error', error);
		return 'error';
	}
};

export { login, logout, register };
