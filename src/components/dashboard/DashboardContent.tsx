import Image from 'next/image';
import Link from 'next/link';
import { RoomVisibility } from '@prisma/client';
import { redirect } from 'next/navigation';
import UserMenu from '~/components/dashboard/UserMenu';
import { auth } from '~/server/auth';
import { db } from '~/server/db';
import CreateRoom from './CreateRoom';
import CommunityView from './CommunityView';
import RoomsView from './RoomsView';
import { ThemeToggle } from '../ui/theme-toggle';
import type { RoomCardData } from './types';

export type DashboardSection = 'recents' | 'community' | 'archived';

const mapRoomToCardData = (room: {
	id: string;
	title: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
	visibility: RoomVisibility;
	ownerId: string;
	owner: { id: string; email: string; name: string | null };
	roomInvites: Array<{ user: { id: string; email: string; name: string | null } }>;
}): RoomCardData => ({
	id: room.id,
	title: room.title,
	description: room.description,
	createdAt: room.createdAt,
	updatedAt: room.updatedAt,
	visibility: room.visibility,
	ownerId: room.ownerId,
	owner: room.owner,
	collaborators: room.roomInvites.map(invite => invite.user),
});

export async function DashboardContent({ section = 'recents' }: { section?: DashboardSection }) {
	const session = await auth();
	if (!session?.user.id) {
		redirect('/signin');
	}

	const user = await db.user.findUniqueOrThrow({
		where: {
			id: session.user.id,
		},
		include: {
			ownedRooms: {
				where: {
					archivedAt: section === 'archived' ? { not: null } : null,
				},
				include: {
					owner: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
					roomInvites: {
						include: {
							user: {
								select: {
									id: true,
									name: true,
									email: true,
								},
							},
						},
					},
				},
				orderBy: { updatedAt: 'desc' },
			},
			roomInvites: {
				include: {
					room: {
						include: {
							owner: {
								select: {
									id: true,
									name: true,
									email: true,
								},
							},
							roomInvites: {
								include: {
									user: {
										select: {
											id: true,
											name: true,
											email: true,
										},
									},
								},
							},
						},
					},
				},
			},
		},
	});

	const communityRoomsRaw =
		section === 'community'
			? await db.room.findMany({
					where: {
						archivedAt: null,
						visibility: RoomVisibility.PUBLIC,
					},
					include: {
						owner: {
							select: {
								id: true,
								name: true,
								email: true,
							},
						},
						roomInvites: {
							include: {
								user: {
									select: {
										id: true,
										name: true,
										email: true,
									},
								},
							},
						},
					},
					orderBy: { updatedAt: 'desc' },
				})
			: [];

	const ownedRooms = user.ownedRooms.map(mapRoomToCardData);
	const sharedRooms = user.roomInvites
		.map(invite => invite.room)
		.filter(room => room.archivedAt === null)
		.map(mapRoomToCardData);
	const archivedRooms = section === 'archived' ? ownedRooms : [];
	const communityRooms = communityRoomsRaw.map(mapRoomToCardData);

	const navItems = [
		{ label: 'Recents', href: '/dashboard', active: section === 'recents' },
		{ label: 'Community', href: '/dashboard/community', active: section === 'community' },
		{ label: 'Archived', href: '/dashboard/archived', active: section === 'archived' },
	];

	const sectionHeading =
		section === 'community'
			? { label: 'Community', title: 'Public design files', subtitle: 'Discover shared public designs from the workspace.' }
			: section === 'archived'
				? { label: 'Archived', title: 'Archived files', subtitle: 'Unarchive or permanently delete old designs.' }
				: { label: 'Recents', title: 'Collaborative files', subtitle: 'Open recent rooms, organize drafts, and jump into the editor.' };

	return (
		<div className="min-h-screen bg-background text-foreground">
			<div className="mx-auto flex min-h-screen max-w-[1520px]">
				<aside className="hidden w-[244px] shrink-0 border-r border-border bg-card px-3 py-3 lg:flex lg:flex-col">
					<div className="mb-3 rounded-[0.6rem] border border-border bg-background p-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Image src="/artifex-logo.ico" alt="Artifex logo" width={16} height={16} />
								<div>
									<p className="text-[10px] uppercase tracking-[0.09em] text-muted-foreground">Artifex</p>
									<h1 className="mt-1 text-[13px] font-medium text-foreground">Workspace</h1>
								</div>
							</div>
							<ThemeToggle />
						</div>
						<div className="mt-3">
							<UserMenu email={user.email} />
						</div>
					</div>
					<div className="figma-section-label px-2">Navigation</div>
					<nav className="mt-2 flex flex-col gap-1">
						{navItems.map(item => (
							<Link
								key={item.href}
								href={item.href}
								className={`rounded-[0.5rem] px-3 py-2 text-left text-[12px] transition ${
									item.active
										? 'bg-primary text-primary-foreground'
										: 'text-muted-foreground hover:bg-muted hover:text-foreground'
								}`}
							>
								{item.label}
							</Link>
						))}
					</nav>
					<div className="mt-4 space-y-2">
						<div className="rounded-[0.6rem] border border-border bg-background px-3 py-2.5">
							<p className="text-[10px] uppercase tracking-[0.09em] text-muted-foreground">Rooms</p>
							<p className="mt-1 text-[18px] text-foreground">
								{user.ownedRooms.length + user.roomInvites.length}
							</p>
						</div>
					</div>
				</aside>
				<main className="flex min-h-screen flex-1 flex-col bg-background">
					<header className="border-b border-border px-4 py-4 sm:px-6">
						<div className="flex flex-wrap items-center justify-between gap-3">
							<div>
								<p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
									{sectionHeading.label}
								</p>
								<h2 className="mt-1 text-[20px] font-medium text-foreground">{sectionHeading.title}</h2>
							</div>
							<div className="flex items-center gap-2">
								<div className="lg:hidden">
									<ThemeToggle />
								</div>
								<CreateRoom />
							</div>
						</div>
						<p className="mt-2 text-[12px] text-muted-foreground">{sectionHeading.subtitle}</p>
					</header>
					<div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
						{section === 'community' ? (
							<CommunityView rooms={communityRooms} currentUserId={session.user.id} />
						) : (
							<RoomsView
								mode={section}
								currentUserId={session.user.id}
								ownedRooms={section === 'archived' ? [] : ownedRooms}
								sharedRooms={section === 'archived' ? [] : sharedRooms}
								archivedRooms={archivedRooms}
							/>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}
