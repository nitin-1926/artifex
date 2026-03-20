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
		<div className="relative mx-auto flex w-full items-center justify-center">
			<div className="relative grid w-full max-w-[980px] overflow-hidden rounded-[0.65rem] border border-white/10 bg-[#252527]">
				<div className="absolute right-4 top-4 z-20">
					<ThemeToggle />
				</div>
				<div className="grid lg:grid-cols-[1fr_420px]">
					<div className="border-b border-white/10 bg-[#2d2d2f] p-7 sm:p-8 lg:border-b-0 lg:border-r lg:border-white/10">
						<div className="flex h-full flex-col justify-between gap-10">
							<div className="space-y-4">
								<p className="text-[10px] uppercase tracking-[0.1em] text-[#a1a1aa]">
									{content.eyebrow}
								</p>
								<h1 className="max-w-xl text-[28px] leading-tight text-[#f4f4f5] sm:text-[32px]">
									{content.title}
								</h1>
								<p className="max-w-lg text-[13px] leading-6 text-[#a1a1aa]">{content.description}</p>
							</div>
							<div className="grid gap-3 sm:grid-cols-3">
								<StatPill label="Shared rooms" value="Team-ready" />
								<StatPill label="Theme system" value="Light and dark" />
								<StatPill label="Workspace" value="Focused UI" />
							</div>
						</div>
					</div>
					<div className="bg-[#252527] p-6 sm:p-8 lg:p-9">
						<div className="mx-auto max-w-md">
							<div className="mb-7 space-y-2.5">
								<p className="text-[10px] uppercase tracking-[0.1em] text-[#9a9a9d]">
									{isSignup ? 'New account' : 'Account access'}
								</p>
								<h2 className="text-[22px] text-[#f4f4f5]">
									{isSignup ? 'Create account' : 'Sign in'}
								</h2>
								<p className="text-[13px] leading-6 text-[#9a9a9d]">
									{isSignup
										? 'Use your email to create a workspace and start collaborating immediately.'
										: 'Use your credentials to open your rooms and continue where you left off.'}
								</p>
							</div>

							<form className="space-y-5" action={formAction}>
								{isSignup && signUpFields()}
								{signInFields()}
								<button
									className="group/btn relative block h-9 w-full overflow-hidden rounded-[0.45rem] bg-[#3f70cb] text-[12px] font-medium text-white transition duration-200 hover:bg-[#4a79d0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5d8dff]/40 disabled:cursor-not-allowed disabled:opacity-70"
									type="submit"
									disabled={isPending}
								>
									<span className="relative z-10">{content.button}</span>
									<BottomGradient />
								</button>

								<div className="h-px w-full bg-white/10" />

								<p className="text-center text-[12px] text-[#9a9a9d]">
									{content.switchCopy}
									<Link
										className="ml-2 font-medium text-[#8eb5ff] transition hover:text-[#bfd6ff]"
										href={content.switchHref}
									>
										{content.switchLabel}
									</Link>
								</p>

								{errorMessage && errorMessage !== 'success' && (
									<p
										role="alert"
										aria-live="polite"
										className="rounded-[0.45rem] border border-destructive/30 bg-destructive/10 px-3 py-2 text-[12px] text-destructive"
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
			<span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),transparent)] opacity-70 transition duration-300 group-hover/btn:opacity-100" />
		</>
	);
};

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
	return <div className={cn('flex w-full flex-col space-y-2', className)}>{children}</div>;
};

const StatPill = ({ label, value }: { label: string; value: string }) => {
	return (
		<div className="rounded-[0.5rem] border border-white/10 bg-[#252527] px-3 py-3">
			<p className="text-[10px] font-medium uppercase tracking-[0.09em] text-[#9a9a9d]">{label}</p>
			<p className="mt-1.5 text-[12px] font-medium text-[#f4f4f5]">{value}</p>
		</div>
	);
};
