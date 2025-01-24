import Link from 'next/link';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { cn } from '~/lib/utils';
import { TextGenerateEffect } from './text-generate-effect';

type AuthFormProps = {
	type: 'signup' | 'signin';
	isPending: boolean;
	errorMessage: string;
	formAction: (formData: FormData) => void;
};

const AuthForm = ({ type, isPending, errorMessage, formAction }: AuthFormProps) => {
	const signUpFields = () => {
		return (
			<div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
				<LabelInputContainer>
					<Label htmlFor="firstName">First name</Label>
					<Input id="firstName" name="firstName" placeholder="Cristiano" type="text" />
				</LabelInputContainer>
				<LabelInputContainer>
					<Label htmlFor="lastName">Last name</Label>
					<Input id="lastName" name="lastName" placeholder="Ronaldo" type="text" />
				</LabelInputContainer>
			</div>
		);
	};

	const signInFields = () => {
		return (
			<>
				<LabelInputContainer className="mb-4">
					<Label htmlFor="email">Email Address</Label>
					<Input id="email" name="email" placeholder="cr7@realmadridfc.com" type="email" />
				</LabelInputContainer>
				<LabelInputContainer className="mb-4">
					<Label htmlFor="password">Password</Label>
					<Input id="password" name="password" placeholder="••••••••" type="password" />
				</LabelInputContainer>
			</>
		);
	};

	const getButtonText = () => {
		switch (type) {
			case 'signup': {
				return isPending ? 'Signing up...' : 'Sign up';
			}
			case 'signin': {
				return isPending ? 'Signing in...' : 'Sign in';
			}
			default:
				return 'Sign in';
		}
	};

	return (
		<div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
			<h2 className="text-center text-lg text-neutral-700 dark:text-neutral-200">
				<TextGenerateEffect words="Welcome to Artifex. Let's create wonders." />
			</h2>

			<form className="my-8" action={formAction}>
				{type === 'signup' && signUpFields()}
				{signInFields()}
				<button
					className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
					type="submit"
					disabled={isPending}
				>
					{getButtonText()}
					<BottomGradient />
				</button>

				<div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

				<p className="text-center text-xs text-gray-600">
					{type === 'signup' ? 'Already have an account?' : "Don't have an account?"}
					<Link
						className="text-blue-400 hover:text-blue-600 ml-1"
						href={type === 'signup' ? '/signin' : '/signup'}
					>
						{type === 'signup' ? 'Log in' : 'Sign up'}
					</Link>
				</p>

				{errorMessage && errorMessage !== 'success' && (
					<p className="text-center text-sm text-red-500">{errorMessage}</p>
				)}
			</form>
		</div>
	);
};

export default AuthForm;

const BottomGradient = () => {
	return (
		<>
			<span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
			<span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
		</>
	);
};

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
	return <div className={cn('flex flex-col space-y-2 w-full', className)}>{children}</div>;
};
