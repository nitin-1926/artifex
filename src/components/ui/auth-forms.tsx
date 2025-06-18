import Link from 'next/link';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { cn } from '~/lib/utils';
import { ThemeToggle } from './theme-toggle';

type AuthFormProps = {
	type: 'signup' | 'signin';
	isPending: boolean;
	errorMessage: string;
	formAction: (formData: FormData) => void;
};

const AuthForm = ({ type, isPending, errorMessage, formAction }: AuthFormProps) => {
	const isSignup = type === 'signup';

	const content = {
		signup: {
			eyebrow: 'Start collaborating',
			title: 'Create your Artifex workspace.',
			description:
				'Set up your account, create rooms, and invite teammates into a cleaner collaborative design workflow.',
			button: isPending ? 'Creating account...' : 'Create account',
			switchCopy: 'Already have an account?',
			switchHref: '/signin',
			switchLabel: 'Log in',
		},
		signin: {
			eyebrow: 'Welcome back',
			title: 'Sign in to continue your work.',
			description:
				'Open recent rooms, continue editing, and jump back into your shared design process without friction.',
			button: isPending ? 'Signing in...' : 'Sign in',
			switchCopy: "Don't have an account?",
			switchHref: '/signup',
			switchLabel: 'Create one',
		},
	}[type];

	const signUpFields = () => {
		return (
			<div className="mb-4 flex flex-col gap-4 md:flex-row">
				<LabelInputContainer>
					<Label htmlFor="firstName">First name</Label>
					<Input id="firstName" name="firstName" placeholder="Ava" type="text" autoComplete="given-name" />
				</LabelInputContainer>
				<LabelInputContainer>
					<Label htmlFor="lastName">Last name</Label>
					<Input id="lastName" name="lastName" placeholder="Morgan" type="text" autoComplete="family-name" />
				</LabelInputContainer>
			</div>
		);
	};

	const signInFields = () => {
		return (
			<>
				<LabelInputContainer className="mb-4">
					<Label htmlFor="email">Email address</Label>
					<Input id="email" name="email" placeholder="ava@artifex.studio" type="email" autoComplete="email" />
				</LabelInputContainer>
				<LabelInputContainer className="mb-4">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						name="password"
						placeholder="••••••••"
						type="password"
						autoComplete="current-password"
					/>
				</LabelInputContainer>
			</>
		);
	};

	return (
		<div className="relative mx-auto flex min-h-screen w-full items-center justify-center px-4 py-8 md:px-8">
			<div className="bg-grid-mask pointer-events-none absolute inset-0 opacity-30" />
			<div className="glass-panel noir-ring relative grid w-full max-w-5xl overflow-hidden rounded-[1.25rem]">
				<div className="absolute right-4 top-4 z-20">
					<ThemeToggle />
				</div>
				<div className="grid lg:grid-cols-[1fr_460px]">
					<div className="border-b border-border/70 bg-card/40 p-8 sm:p-10 lg:border-b-0 lg:border-r">
						<div className="flex h-full flex-col justify-between gap-10">
							<div className="space-y-4">
								<p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-primary/80">
									{content.eyebrow}
								</p>
								<h1 className="max-w-xl text-3xl leading-tight text-foreground sm:text-4xl">
									{content.title}
								</h1>
								<p className="max-w-lg text-sm leading-7 text-muted-foreground">
									{content.description}
								</p>
							</div>
							<div className="grid gap-3 sm:grid-cols-3">
								<StatPill label="Shared rooms" value="Team-ready" />
								<StatPill label="Theme system" value="Light and dark" />
								<StatPill label="Workspace" value="Focused UI" />
							</div>
						</div>
					</div>
					<div className="bg-background p-6 sm:p-8 lg:p-10">
						<div className="mx-auto max-w-md">
							<div className="mb-8 space-y-3">
								<p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
									{isSignup ? 'New account' : 'Account access'}
								</p>
								<h2 className="text-2xl text-foreground">{isSignup ? 'Create account' : 'Sign in'}</h2>
								<p className="text-sm leading-7 text-muted-foreground">
									{isSignup
										? 'Use your email to create a workspace and start collaborating immediately.'
										: 'Use your credentials to open your rooms and continue where you left off.'}
								</p>
							</div>

							<form className="space-y-5" action={formAction}>
								{isSignup && signUpFields()}
								{signInFields()}
								<button
									className="group/btn relative block h-11 w-full overflow-hidden rounded-[0.9rem] bg-primary text-sm font-semibold text-primary-foreground transition duration-200 hover:bg-primary/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-70"
									type="submit"
									disabled={isPending}
								>
									<span className="relative z-10">{content.button}</span>
									<BottomGradient />
								</button>

								<div className="h-px w-full bg-border/80" />

								<p className="text-center text-sm text-muted-foreground">
									{content.switchCopy}
									<Link
										className="ml-2 font-semibold text-primary transition hover:text-foreground"
										href={content.switchHref}
									>
										{content.switchLabel}
									</Link>
								</p>

								{errorMessage && errorMessage !== 'success' && (
									<p
										role="alert"
										aria-live="polite"
										className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
									>
										{errorMessage}
									</p>
								)}
							</form>
						</div>
					</div>
				</div>
			</div>
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
