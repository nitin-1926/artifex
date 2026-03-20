'use client';

import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import AuthForm from '~/components/ui/auth-forms';
import { login } from '../actions/auth';

const SigninPage = () => {
	const router = useRouter();
	const [errorMessage, formAction, isPending] = useActionState(login, undefined);

	useEffect(() => {
		if (errorMessage === 'success') {
			router.push('/dashboard');
		}
	}, [errorMessage, router]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-[#1f1f1f] p-4">
			<AuthForm type="signin" isPending={isPending} errorMessage={errorMessage ?? ''} formAction={formAction} />
		</div>
	);
};

export default SigninPage;
