'use client';

import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import AuthForm from '~/components/ui/auth-forms';
import { BackgroundBeamsWithCollision } from '~/components/ui/background-beams-with-collision';
import { register } from '../actions/auth';

const SignupPage = () => {
	const router = useRouter();
	const [errorMessage, formAction, isPending] = useActionState(register, undefined);

	useEffect(() => {
		if (errorMessage === 'success') {
			router.push('/signin');
		}
	}, [errorMessage, router]);

	return (
		<div className="flex min-h-screen items-center justify-center">
			<BackgroundBeamsWithCollision>
				<AuthForm
					type="signup"
					isPending={isPending}
					errorMessage={errorMessage ?? ''}
					formAction={formAction}
				/>
			</BackgroundBeamsWithCollision>
		</div>
	);
};

export default SignupPage;
