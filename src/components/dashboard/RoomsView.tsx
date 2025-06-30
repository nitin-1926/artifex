'use client';

import { type Room } from '@prisma/client';
import { ArrowUpRight, Clock3, FolderKanban, Layers3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { deleteRoom, updateRoomTitle } from '~/app/actions/rooms';
import { cn } from '~/lib/utils';
import ConfirmationModal from './ConfirmationModal';

const ROOM_TONES = [
	'bg-slate-50 dark:bg-slate-900/70',
	'bg-blue-50 dark:bg-slate-900/70',
	'bg-violet-50 dark:bg-slate-900/70',
	'bg-cyan-50 dark:bg-slate-900/70',
];

const ViewModeButton = ({ onSelect, active, text }: { onSelect: () => void; active: boolean; text: string }) => {
	return (
		<button
			type="button"
			onClick={onSelect}
			className={cn(
				'rounded-[0.7rem] px-3 py-1.5 text-[13px] font-medium transition duration-200',
				active
					? 'bg-primary text-primary-foreground'
					: 'bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground',
			)}
		>
			{text}
		</button>
	);
};

const SingleRoom = ({
	id,
	title,
	description,
	color,
	selected,
	select,
	navigateTo,
	canEdit,
}: {
	id: string;
	title: string;
	description: string;
	color: string;
	selected: boolean;
	select: () => void;
	navigateTo: () => void;
	canEdit: boolean;
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editedTitle, setEditedTitle] = useState(title);
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);

	const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			setIsEditing(false);
			await updateRoomTitle(id, editedTitle);
		}
	};

	const handleBlur = async () => {
		setIsEditing(false);
		await updateRoomTitle(id, editedTitle);
	};

	const confirmDelete = async () => {
		await deleteRoom(id);
		setShowConfirmationModal(false);
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
		<div className="flex flex-col gap-2.5">
			<div
				className={cn(
					'rounded-[0.85rem] border p-[1px] transition duration-200',
					selected ? 'border-primary/55 shadow-[0_10px_24px_-24px_rgba(37,99,235,0.55)]' : 'border-border/80',
				)}
			>
				<button
					type="button"
					onDoubleClick={navigateTo}
					onClick={select}
					className={cn(
						'flex w-full cursor-pointer flex-col gap-4 rounded-[calc(0.85rem-1px)] border border-transparent p-4 text-left transition duration-200',
						color,
					)}
				>
					<div className="flex items-start justify-between gap-4">
						<div className="space-y-2">
							<div className="inline-flex rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
								{canEdit ? 'Owner room' : 'Shared with you'}
							</div>
							<div className="space-y-1.5">
								<h3 className="line-clamp-2 text-lg leading-tight text-foreground">{title}</h3>
								<p className="text-[13px] text-muted-foreground">{description}</p>
							</div>
						</div>
						<div className="rounded-[0.7rem] border border-border/70 bg-background/80 p-2 text-muted-foreground">
							<FolderKanban className="h-3.5 w-3.5" />
						</div>
					</div>
					<div className="flex items-center gap-4 text-[11px] text-muted-foreground">
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
				<div className="min-w-0">
					{isEditing && canEdit ? (
						<input
							type="text"
							value={editedTitle}
							onChange={e => setEditedTitle(e.target.value)}
							onBlur={handleBlur}
							onKeyDown={handleKeyPress}
							autoFocus
							className="w-full rounded-[0.7rem] border border-border/70 bg-background px-3 py-2 text-[13px] font-semibold text-foreground outline-none focus:border-primary"
						/>
					) : (
						<button
							type="button"
							onClick={() => canEdit && setIsEditing(true)}
							className="truncate text-left text-[13px] font-semibold text-foreground transition hover:text-primary"
						>
							{title}
						</button>
					)}
					<p className="mt-1 select-none text-[11px] text-muted-foreground">
						Use the arrow button to open the editor.
					</p>
				</div>
				<button
					type="button"
					onClick={navigateTo}
					className="inline-flex h-8 w-8 items-center justify-center rounded-[0.7rem] border border-border/70 bg-background text-foreground transition hover:border-primary/45 hover:text-primary"
					aria-label={`Open ${title}`}
				>
					<ArrowUpRight className="h-3.5 w-3.5" />
				</button>
			</div>
			<ConfirmationModal
				isOpen={showConfirmationModal}
				onClose={() => setShowConfirmationModal(false)}
				onConfirm={confirmDelete}
				message="Are you sure you want to delete this room?"
			/>
		</div>
	);
};

const RoomsView = ({ ownedRooms, roomInvites }: { ownedRooms: Room[]; roomInvites: Room[] }) => {
	const [viewMode, setViewMode] = useState('owns');
	const [selected, setSelected] = useState<string | null>(null);
	const router = useRouter();
	const outerDivRef = useRef<HTMLDivElement>(null);

	const filteredRooms = useMemo(() => {
		if (viewMode === 'owns') {
			return ownedRooms;
		} else if (viewMode === 'shared') {
			return roomInvites;
		}
		return [];
	}, [viewMode, ownedRooms, roomInvites]);

	const roomColors = useMemo(() => {
		return filteredRooms.map((room, index) => ({
			id: room.id,
			color: PASTEL_COLORS[index % PASTEL_COLORS.length],
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
			<div className="flex gap-1">
				<ViewModeButton onSelect={() => setViewMode('owns')} active={viewMode === 'owns'} text="My project" />
				<ViewModeButton
					onSelect={() => setViewMode('shared')}
					active={viewMode === 'shared'}
					text="Shared files"
				/>
			</div>
			<div className="flex flex-wrap gap-4">
				{filteredRooms.map(room => {
					const roomColor = roomColors.find(rc => rc.id === room.id)?.color ?? PASTEL_COLORS[0]!;

					return (
						<React.Fragment key={room.id}>
							<SingleRoom
								id={room.id}
								title={room.title}
								description={`Created ${room.createdAt.toDateString()}`}
								color={roomColor}
								selected={selected === room.id}
								select={() => setSelected(room.id)}
								navigateTo={() => router.push('/dashboard/' + room.id)}
								canEdit={viewMode === 'owns'}
							/>
						</React.Fragment>
					);
				})}
			</div>
		</div>
	);
};

export default RoomsView;
