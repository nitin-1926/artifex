import UserMenu from '~/components/dashboard/UserMenu';
import { ThemeToggle } from '~/components/ui/theme-toggle';
import { auth } from '~/server/auth';
import { db } from '~/server/db';
import CreateRoom from './CreateRoom';
import RoomsView from './RoomsView';

export async function DashboardContent() {
	const session = await auth();

	const user = await db.user.findUniqueOrThrow({
		where: {
			id: session?.user.id,
		},
		include: {
			ownedRooms: true,
			roomInvites: {
				include: {
					room: true,
				},
			},
		},
	});

	return (
		<div className="relative min-h-screen">
			<div className="bg-grid-mask pointer-events-none absolute inset-0 opacity-20" />
			<div className="relative mx-auto flex min-h-screen max-w-[1360px] gap-3 p-3 lg:p-4">
				<aside className="glass-panel hidden w-[280px] shrink-0 rounded-[0.85rem] p-4 lg:flex lg:flex-col">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
								Artifex
							</p>
							<h1 className="mt-1.5 text-xl text-foreground">Workspace</h1>
						</div>
						<ThemeToggle />
					</div>
					<div className="mt-6">
						<UserMenu email={user.email} />
					</div>
					<div className="mt-8 space-y-3">
						<div className="rounded-[0.8rem] border border-border/70 bg-card p-4">
							<p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
								Rooms
							</p>
							<p className="mt-2 text-2xl text-foreground">
								{user.ownedRooms.length + user.roomInvites.length}
							</p>
							<p className="mt-1.5 text-[13px] leading-5 text-muted-foreground">
								Accessible across your personal and shared workspace.
							</p>
						</div>
						<div className="rounded-[0.8rem] border border-border/70 bg-card p-4">
							<p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
								Environment
							</p>
							<p className="mt-2 text-[15px] font-semibold text-foreground">Premium SaaS shell</p>
							<p className="mt-1.5 text-[13px] leading-5 text-muted-foreground">
								Clean navigation, quieter surfaces, and a stronger workspace hierarchy.
							</p>
						</div>
					</div>
				</aside>
				<main className="glass-panel relative flex min-h-[calc(100dvh-1.5rem)] flex-1 flex-col overflow-hidden rounded-[0.85rem]">
					<div className="flex flex-col gap-4 border-b border-border/70 px-5 py-5 sm:px-6">
						<div className="flex items-start justify-between gap-4 lg:hidden">
							<div>
								<p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
									Artifex
								</p>
								<h1 className="mt-1.5 text-xl text-foreground">Workspace</h1>
							</div>
							<ThemeToggle />
						</div>
						<div className="lg:hidden">
							<UserMenu email={user.email} />
						</div>
						<div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
							<div className="max-w-2xl">
								<p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
									Dashboard
								</p>
								<h2 className="mt-1.5 text-[1.8rem] leading-tight text-foreground sm:text-[2.1rem]">
									Recent rooms and collaborative files.
								</h2>
								<p className="mt-2 max-w-xl text-[14px] leading-6 text-muted-foreground">
									Create a new room, open existing work, and move between personal and shared files in
									a calmer workspace shell.
								</p>
							</div>
							<CreateRoom />
						</div>
					</div>
					<div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
						<RoomsView ownedRooms={user.ownedRooms} roomInvites={user.roomInvites.map(x => x.room)} />
					</div>
				</main>
			</div>
		</div>
	);
}
