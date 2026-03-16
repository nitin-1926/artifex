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
		<div className="min-h-screen bg-[#1f1f1f] text-[#f5f5f5]">
			<div className="mx-auto flex min-h-screen max-w-[1520px]">
				<aside className="hidden w-[236px] shrink-0 border-r border-white/10 bg-[#252526] px-3 py-3 lg:flex lg:flex-col">
					<div className="mb-3 rounded-[0.6rem] border border-white/10 bg-[#2b2b2b] p-3">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-[10px] uppercase tracking-[0.09em] text-[#b6b6b6]">Artifex</p>
								<h1 className="mt-1 text-[13px] font-medium text-[#f4f4f5]">Workspace</h1>
							</div>
							<ThemeToggle />
						</div>
						<div className="mt-3">
							<UserMenu email={user.email} />
						</div>
					</div>
					<div className="figma-section-label px-2">Main</div>
					<nav className="mt-2 flex flex-col gap-1">
						<button
							type="button"
							className="rounded-[0.5rem] bg-[#3a3a3a] px-3 py-2 text-left text-[12px] text-[#f5f5f5]"
						>
							Recents
						</button>
						<button
							type="button"
							className="rounded-[0.5rem] px-3 py-2 text-left text-[12px] text-[#b6b6b6] transition hover:bg-[#2f2f2f] hover:text-white"
						>
							Community
						</button>
						<button
							type="button"
							className="rounded-[0.5rem] px-3 py-2 text-left text-[12px] text-[#b6b6b6] transition hover:bg-[#2f2f2f] hover:text-white"
						>
							Shared with me
						</button>
					</nav>
					<div className="mt-4 space-y-2">
						<div className="rounded-[0.6rem] border border-white/10 bg-[#2b2b2b] px-3 py-2.5">
							<p className="text-[10px] uppercase tracking-[0.09em] text-[#a1a1aa]">Rooms</p>
							<p className="mt-1 text-[18px] text-white">{user.ownedRooms.length + user.roomInvites.length}</p>
						</div>
					</div>
				</aside>
				<main className="flex min-h-screen flex-1 flex-col bg-[#1f1f1f]">
					<header className="border-b border-white/10 px-4 py-4 sm:px-6">
						<div className="flex flex-wrap items-center justify-between gap-3">
							<div>
								<p className="text-[10px] uppercase tracking-[0.1em] text-[#a1a1aa]">Recents</p>
								<h2 className="mt-1 text-[20px] font-medium text-[#f4f4f5]">Collaborative files</h2>
							</div>
							<div className="flex items-center gap-2">
								<div className="lg:hidden">
									<ThemeToggle />
								</div>
								<CreateRoom />
							</div>
						</div>
						<p className="mt-2 text-[12px] text-[#a1a1aa]">
							Open recent rooms, organize drafts, and jump into the editor.
						</p>
					</header>
					<div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
						<RoomsView ownedRooms={user.ownedRooms} roomInvites={user.roomInvites.map(x => x.room)} />
					</div>
				</main>
			</div>
		</div>
	);
}
