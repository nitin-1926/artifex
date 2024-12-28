'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { login } from '../actions/auth';

const SigninPage = () => {
	const [errorMessage, formAction, isPending] = useActionState(login, undefined);

	return (
		<div className="flex min-h-screen items-center justify-center bg-white px-4">
			<div className="w-full max-w-sm space-y-6">
				<h1 className="text-center text-2xl font-semibold text-gray-900">Sign In</h1>
				<form action={formAction} className="space-y-4">
					<input type="hidden" name="redirectTo" value="/dashboard" />
					<div className="relative h-fit">
						<input
							className="w-full rounded-md border border-gray-300 text-sm px-3 pb-1 pt-7 focus:border-black"
							type="email"
							name="email"
							required
						/>
						<label className="absolute left-3 top-2 text-[12px] text-gray-500">EMAIL</label>
					</div>
					<div className="relative h-fit">
						<input
							className="w-full rounded-md border border-gray-300 text-sm px-3 pb-1 pt-7 focus:border-black"
							type="password"
							name="password"
							required
							minLength={8}
						/>
						<label className="absolute left-3 top-2 text-[12px] text-gray-500">PASSWORD</label>
					</div>
					<button
						disabled={isPending}
						className="w-full rounded-md bg-black px-3 py-2 text-white hover:bg-gray-900 focus:outline-none disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed"
					>
						{isPending ? 'Logging in...' : 'Log in'}
					</button>

					<p className="text-center text-xs text-gray-600">
						Don&apos;t have an account?{' '}
						<Link className="text-blue-400 hover:text-blue-600" href="/signup">
							Sign up
						</Link>
					</p>

					{errorMessage && <p className="text-center text-sm text-red-500">{errorMessage}</p>}
				</form>
			</div>
		</div>
	);
};

export default SigninPage;
