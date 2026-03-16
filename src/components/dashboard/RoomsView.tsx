'use client';

import { RoomVisibility } from '@prisma/client';
import { ArchiveRestore, ArrowUpRight, Clock3, FolderKanban, Globe2, Layers3, Lock, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	archiveRoom,
	deleteRoomPermanently,
	unarchiveRoom,
	updateRoomDescription,
	updateRoomTitle,
	updateRoomVisibility,
} from '~/app/actions/rooms';
import { cn } from '~/lib/utils';
import ShareMenu from '../Sidebars/ShareMenu';
import ConfirmationModal from './ConfirmationModal';
import { type RoomCardData } from './types';

const ROOM_TONES = [
	'bg-[#dce6ef] text-[#1f2937] dark:bg-[#2f3844] dark:text-[#f3f4f6]',
	'bg-[#e8e2f3] text-[#1f2937] dark:bg-[#3b3245] dark:text-[#f3f4f6]',
	'bg-[#e3ece5] text-[#1f2937] dark:bg-[#2f3d37] dark:text-[#f3f4f6]',
	'bg-[#e7e9ee] text-[#1f2937] dark:bg-[#343943] dark:text-[#f3f4f6]',
];

const ViewModeButton = ({ onSelect, active, text }: { onSelect: () => void; active: boolean; text: string }) => {
	return (
		<button
			type="button"
			onClick={onSelect}
			className={cn(
				'rounded-[0.45rem] border px-2.5 py-1 text-[11px] font-medium transition duration-200',
				active
					? 'border-primary bg-primary text-primary-foreground'
					: 'border-border bg-card text-muted-foreground hover:bg-muted',
			)}
		>
			{text}
		</button>
	);
};

const SingleRoom = ({
	room,
	color,
	selected,
	select,
	navigateTo,
	canEdit,
	isArchived,
}: {
	room: RoomCardData;
	color: string;
	selected: boolean;
	select: () => void;
	navigateTo: () => void;
	canEdit: boolean;
	isArchived: boolean;
}) => {
	const { id, title, description, visibility, owner, collaborators } = room;
	const [isEditing, setIsEditing] = useState(false);
	const [editedTitle, setEditedTitle] = useState(title);
	const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
	const [editedDescription, setEditedDescription] = useState(description);
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [showPermanentDeleteModal, setShowPermanentDeleteModal] = useState(false);

	const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			setIsEditing(false);
			await updateRoomTitle(id, editedTitle);
		}
	};

	const handleDescriptionKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			setIsDescriptionEditing(false);
			await updateRoomDescription(id, editedDescription);
		}
	};

	const handleBlur = async () => {
		setIsEditing(false);
		await updateRoomTitle(id, editedTitle);
	};

	const handleDescriptionBlur = async () => {
		setIsDescriptionEditing(false);
		await updateRoomDescription(id, editedDescription);
	};

	const confirmDelete = async () => {
		await archiveRoom(id);
		setShowConfirmationModal(false);
	};

	const confirmPermanentDelete = async () => {
		await deleteRoomPermanently(id);
		setShowPermanentDeleteModal(false);
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Backspace' && selected && !isEditing) {
				e.preventDefault();
				setShowConfirmationModal(true);
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [selected, id, isEditing]);

	return (
		<div className="group flex flex-col gap-2">
			<div
				className={cn(
					'relative rounded-[0.62rem] border bg-card p-[1px] transition duration-200',
					selected ? 'border-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.35)]' : 'border-border',
				)}
			>
				{canEdit && !isArchived && (
					<button
						type="button"
						onClick={() => setShowConfirmationModal(true)}
						className="absolute right-2 top-2 z-20 inline-flex h-7 w-7 items-center justify-center rounded-[0.45rem] border border-destructive/20 bg-card/90 text-destructive opacity-0 transition group-hover:opacity-100 hover:bg-destructive/10"
						aria-label={`Archive ${title}`}
					>
						<Trash2 className="h-3.5 w-3.5" />
					</button>
				)}
				<button
					type="button"
					onDoubleClick={navigateTo}
					onClick={select}
					className={cn(
						'flex w-full cursor-pointer flex-col rounded-[calc(0.62rem-1px)] text-left transition duration-200',
					)}
				>
					<div className={cn('rounded-t-[calc(0.62rem-1px)] px-4 pb-5 pt-4', color)}>
						<div className="space-y-1.5">
							<div className="inline-flex rounded-[0.35rem] border border-black/10 bg-white/60 px-2 py-0.5 text-[9px] uppercase tracking-[0.08em] text-[#445269] dark:border-white/10 dark:bg-black/20 dark:text-[#d4d4d8]">
								{isArchived ? 'Archived' : canEdit ? 'Owner room' : 'Shared with you'}
							</div>
							<h3 className="line-clamp-2 text-[25px] leading-[1.03]">{title}</h3>
						</div>
					</div>
					<div className="flex items-center justify-between rounded-b-[calc(0.62rem-1px)] border-t border-border bg-card px-4 py-2.5 text-[10px] text-muted-foreground">
						<div className="flex items-center gap-2">
							<Layers3 className="h-3 w-3" />
							<span>Design file</span>
						</div>
						<div className="flex items-center gap-2">
							<Clock3 className="h-3 w-3" />
							<span>Ready to open</span>
						</div>
					</div>
				</button>
			</div>
			<div className="flex items-center justify-between gap-3">
				<div className="min-w-0 flex-1">
					{isEditing && canEdit ? (
						<input
							type="text"
							value={editedTitle}
							onChange={e => setEditedTitle(e.target.value)}
							onBlur={handleBlur}
							onKeyDown={handleKeyPress}
							autoFocus
							className="w-full rounded-[0.45rem] border border-border bg-card px-2.5 py-1.5 text-[12px] font-medium text-foreground outline-none focus:border-primary"
						/>
					) : (
						<button
							type="button"
							onClick={() => canEdit && setIsEditing(true)}
							className="truncate text-left text-[12px] font-medium text-foreground transition hover:text-primary"
						>
							{title}
						</button>
					)}
					{isDescriptionEditing && canEdit ? (
						<input
							type="text"
							value={editedDescription}
							onChange={e => setEditedDescription(e.target.value)}
							onBlur={handleDescriptionBlur}
							onKeyDown={handleDescriptionKeyPress}
							autoFocus
							className="mt-1 w-full rounded-[0.45rem] border border-border bg-card px-2.5 py-1.5 text-[11px] text-muted-foreground outline-none focus:border-primary"
						/>
					) : (
						<button
							type="button"
							onClick={() => canEdit && setIsDescriptionEditing(true)}
							className={`mt-1 line-clamp-2 text-left text-[11px] ${
								canEdit
									? 'text-muted-foreground transition hover:text-foreground'
									: 'cursor-default text-muted-foreground'
							}`}
						>
							{description}
						</button>
					)}
				</div>
				<div className="flex items-center gap-1.5">
					{canEdit && !isArchived && (
						<button
							type="button"
							onClick={() =>
								updateRoomVisibility(
									id,
									visibility === RoomVisibility.PUBLIC ? RoomVisibility.PRIVATE : RoomVisibility.PUBLIC,
								)
							}
							className="inline-flex h-7 items-center gap-1 rounded-[0.45rem] border border-border bg-card px-2 text-[10px] text-muted-foreground transition hover:border-primary/50 hover:text-primary"
						>
							{visibility === RoomVisibility.PUBLIC ? <Globe2 className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
							{visibility === RoomVisibility.PUBLIC ? 'Public' : 'Private'}
						</button>
					)}
					{canEdit && !isArchived && (
						<ShareMenu
							roomId={id}
							roomName={title}
							roomVisibility={visibility}
							owner={owner}
							othersWithAccessToRoom={collaborators}
							triggerLabel="↗"
							triggerClassName="inline-flex h-7 w-7 items-center justify-center rounded-[0.45rem] border border-border bg-card text-muted-foreground transition hover:border-primary/50 hover:text-primary"
						/>
					)}
					{isArchived && canEdit && (
						<>
							<button
								type="button"
								onClick={() => unarchiveRoom(id)}
								className="inline-flex h-7 w-7 items-center justify-center rounded-[0.45rem] border border-border bg-card text-muted-foreground transition hover:border-primary/50 hover:text-primary"
								aria-label={`Unarchive ${title}`}
							>
								<ArchiveRestore className="h-3.5 w-3.5" />
							</button>
							<button
								type="button"
								onClick={() => setShowPermanentDeleteModal(true)}
								className="inline-flex h-7 w-7 items-center justify-center rounded-[0.45rem] border border-destructive/35 bg-card text-destructive transition hover:bg-destructive/10"
								aria-label={`Delete ${title} permanently`}
							>
								<Trash2 className="h-3.5 w-3.5" />
							</button>
						</>
					)}
					{!isArchived && (
						<button
							type="button"
							onClick={navigateTo}
							className="inline-flex h-7 w-7 items-center justify-center rounded-[0.45rem] border border-border bg-card text-muted-foreground transition hover:border-primary/50 hover:text-primary"
							aria-label={`Open ${title}`}
						>
							<ArrowUpRight className="h-3.5 w-3.5" />
						</button>
					)}
				</div>
			</div>
			<ConfirmationModal
				isOpen={showConfirmationModal}
				onClose={() => setShowConfirmationModal(false)}
				onConfirm={confirmDelete}
				message="Move this design to archived?"
			/>
			<ConfirmationModal
				isOpen={showPermanentDeleteModal}
				onClose={() => setShowPermanentDeleteModal(false)}
				onConfirm={confirmPermanentDelete}
				message="Delete this design permanently? This cannot be undone."
			/>
		</div>
	);
};

const RoomsView = ({
	mode,
	ownedRooms,
	sharedRooms,
	archivedRooms,
	currentUserId,
}: {
	mode: 'recents' | 'archived';
	ownedRooms: RoomCardData[];
	sharedRooms: RoomCardData[];
	archivedRooms: RoomCardData[];
	currentUserId: string;
}) => {
	const [viewMode, setViewMode] = useState('owns');
	const [selected, setSelected] = useState<string | null>(null);
	const router = useRouter();
	const outerDivRef = useRef<HTMLDivElement>(null);

	const filteredRooms = useMemo(() => {
		if (mode === 'archived') {
			return archivedRooms;
		}
		if (viewMode === 'owns') {
			return ownedRooms;
		} else if (viewMode === 'shared') {
			return sharedRooms;
		}
		return [];
	}, [mode, viewMode, ownedRooms, sharedRooms, archivedRooms]);

	const roomColors = useMemo(() => {
		return filteredRooms.map((room, index) => ({
			id: room.id,
			color: ROOM_TONES[index % ROOM_TONES.length],
		}));
	}, [filteredRooms]);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (outerDivRef.current && !outerDivRef.current.contains(e.target as Node)) {
				setSelected(null);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div ref={outerDivRef} className="flex flex-col gap-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				{mode !== 'archived' ? (
					<div className="flex gap-2">
						<ViewModeButton
							onSelect={() => setViewMode('owns')}
							active={viewMode === 'owns'}
							text="My projects"
						/>
						<ViewModeButton
							onSelect={() => setViewMode('shared')}
							active={viewMode === 'shared'}
							text="Shared files"
						/>
					</div>
				) : (
					<div />
				)}
				<div className="flex items-center gap-2 rounded-[0.45rem] border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground">
					<FolderKanban className="h-3.5 w-3.5" />
					<span>
						{filteredRooms.length} {mode === 'archived' ? 'archived' : 'active'} room
						{filteredRooms.length === 1 ? '' : 's'}
					</span>
				</div>
			</div>
			{filteredRooms.length === 0 ? (
				<div className="rounded-[0.6rem] border border-border bg-card px-6 py-10 text-center">
					<p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
						No rooms yet
					</p>
					<h3 className="mt-2 text-[18px] text-foreground">
						{mode === 'archived'
							? 'Nothing archived yet.'
							: viewMode === 'owns'
							? 'Start your first design room.'
							: 'Nothing has been shared with you yet.'}
					</h3>
					<p className="mx-auto mt-2 max-w-lg text-[12px] leading-6 text-muted-foreground">
						{mode === 'archived'
							? 'Archived files will appear here. You can restore or permanently delete them.'
							: viewMode === 'owns'
							? 'Use the call-to-action above to create a fresh workspace and begin shaping your next artifact.'
							: 'Once a teammate invites you into a room, it will appear here with the same live collaboration experience.'}
					</p>
				</div>
			) : (
				<div className="grid gap-4 xl:grid-cols-3">
					{filteredRooms.map(room => {
						const roomColor = roomColors.find(rc => rc.id === room.id)?.color ?? ROOM_TONES[0]!;

						return (
							<React.Fragment key={room.id}>
								<SingleRoom
									room={room}
									color={roomColor}
									selected={selected === room.id}
									select={() => setSelected(room.id)}
									navigateTo={() => router.push('/dashboard/' + room.id)}
									canEdit={room.ownerId === currentUserId}
									isArchived={mode === 'archived'}
								/>
							</React.Fragment>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default RoomsView;
