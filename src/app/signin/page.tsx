'use client';

import { useActionState } from 'react';
import AuthForm from '~/components/ui/auth-forms';
import { BackgroundBeamsWithCollision } from '~/components/ui/background-beams-with-collision';
import { login } from '../actions/auth';

const SigninPage = () => {
	const [errorMessage, formAction, isPending] = useActionState(login, undefined);

	return (
		<div className="flex min-h-screen items-center justify-center">
			<BackgroundBeamsWithCollision>
				<AuthForm
					type="signin"
					isPending={isPending}
					errorMessage={errorMessage ?? ''}
					formAction={formAction}
				/>
			</BackgroundBeamsWithCollision>
		</div>
	);
};

export default SigninPage;
