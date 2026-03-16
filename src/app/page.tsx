import Link from 'next/link';
import { ArrowRight, CheckCircle2, Layers3, PenSquare, UsersRound } from 'lucide-react';
import { auth } from '~/server/auth';

const FEATURES = [
	{
		title: 'Collaborative editor',
		description: 'Design in shared rooms with live cursors and immediate updates.',
		icon: UsersRound,
	},
	{
		title: 'Precision controls',
		description: 'Edit layer position, dimensions, typography, and color from side panels.',
		icon: Layers3,
	},
	{
		title: 'Focused workflow',
		description: 'Clean recents, fast file switching, and consistent dark-first workspace chrome.',
		icon: PenSquare,
	},
];

export default async function HomePage() {
	const session = await auth();
	const ctaHref = session?.user?.id ? '/dashboard' : '/signin';
	const ctaLabel = session?.user?.id ? 'Open dashboard' : 'Start with email';

	return (
		<div className="min-h-screen bg-[#1f1f1f] text-[#f4f4f5]">
			<header className="mx-auto flex w-full max-w-[1220px] items-center justify-between px-5 py-4 sm:px-8">
				<div className="flex items-center gap-2.5">
					<div className="flex h-7 w-7 items-center justify-center rounded-[0.45rem] bg-[#2e2e30] text-[11px] font-semibold text-white">
						A
					</div>
					<p className="text-[12px] font-medium tracking-[0.01em]">Artifex</p>
				</div>
				<div className="flex items-center gap-2">
					<Link
						href="/signin"
						className="rounded-[0.45rem] border border-white/15 bg-[#2a2a2a] px-3 py-1.5 text-[11px] text-[#d4d4d8] transition hover:border-white/25 hover:text-white"
					>
						Sign in
					</Link>
					<Link
						href={ctaHref}
						className="inline-flex items-center gap-1 rounded-[0.45rem] bg-[#3f70cb] px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-[#4a79d0]"
					>
						{ctaLabel}
						<ArrowRight className="h-3.5 w-3.5" />
					</Link>
				</div>
			</header>

			<main className="mx-auto grid w-full max-w-[1220px] gap-8 px-5 pb-14 pt-7 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
				<section>
					<p className="text-[10px] uppercase tracking-[0.1em] text-[#a1a1aa]">Modern collaborative canvas</p>
					<h1 className="mt-3 max-w-2xl text-[42px] leading-[1.03] text-white sm:text-[56px]">
						Design workflows that feel crisp, calm, and premium.
					</h1>
					<p className="mt-4 max-w-xl text-[14px] leading-7 text-[#a1a1aa]">
						Artifex brings Figma-inspired structure to your workspace: recents outside the editor, focused
						panels inside, and fast room-based collaboration for every project.
					</p>
					<div className="mt-6 flex flex-wrap gap-2">
						<Link
							href={ctaHref}
							className="inline-flex items-center gap-2 rounded-[0.45rem] bg-[#3f70cb] px-4 py-2 text-[12px] font-medium text-white transition hover:bg-[#4a79d0]"
						>
							{ctaLabel}
							<ArrowRight className="h-3.5 w-3.5" />
						</Link>
						<Link
							href="/dashboard"
							className="rounded-[0.45rem] border border-white/15 bg-[#2a2a2a] px-4 py-2 text-[12px] text-[#d4d4d8] transition hover:border-white/25 hover:text-white"
						>
							View workspace
						</Link>
					</div>
					<div className="mt-8 grid gap-2 sm:grid-cols-2">
						{['Dark-first UI system', 'Theme tokens for all surfaces', 'Room sharing and invites', 'Live layer editing'].map(item => (
							<div
								key={item}
								className="flex items-center gap-2 rounded-[0.5rem] border border-white/10 bg-[#2b2b2d] px-3 py-2 text-[12px] text-[#d4d4d8]"
							>
								<CheckCircle2 className="h-3.5 w-3.5 text-[#8eb5ff]" />
								<span>{item}</span>
							</div>
						))}
					</div>
				</section>

				<section className="rounded-[0.65rem] border border-white/10 bg-[#252527] p-3">
					<div className="rounded-[0.5rem] border border-white/10 bg-[#2e2e30] p-3">
						<div className="flex items-center justify-between border-b border-white/10 pb-2">
							<p className="text-[10px] uppercase tracking-[0.1em] text-[#9a9a9d]">Workspace preview</p>
							<span className="rounded-[0.4rem] bg-[#3a3a3a] px-2 py-0.5 text-[10px] text-[#c7c7cb]">Recents</span>
						</div>
						<div className="mt-3 grid grid-cols-2 gap-2">
							{['Agentic workflow', 'Milestones 2025', 'Template variations', 'Design handoff'].map(file => (
								<div key={file} className="overflow-hidden rounded-[0.45rem] border border-white/10 bg-[#242425]">
									<div className="h-16 bg-[#dfe5f0]" />
									<div className="border-t border-white/10 px-2.5 py-2">
										<p className="truncate text-[11px] text-[#f4f4f5]">{file}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>
			</main>

			<section className="mx-auto w-full max-w-[1220px] px-5 pb-14 sm:px-8">
				<div className="grid gap-3 md:grid-cols-3">
					{FEATURES.map(feature => {
						const Icon = feature.icon;
						return (
							<div key={feature.title} className="rounded-[0.55rem] border border-white/10 bg-[#2a2a2b] p-4">
								<div className="flex h-7 w-7 items-center justify-center rounded-[0.45rem] bg-[#353538] text-[#bad0ff]">
									<Icon className="h-4 w-4" />
								</div>
								<h2 className="mt-3 text-[15px] text-white">{feature.title}</h2>
								<p className="mt-1.5 text-[12px] leading-6 text-[#a1a1aa]">{feature.description}</p>
							</div>
						);
					})}
				</div>
			</section>
		</div>
	);
}
