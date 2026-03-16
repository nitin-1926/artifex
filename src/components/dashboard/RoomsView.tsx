'use client';

import { type Room } from '@prisma/client';
import { ArrowUpRight, Clock3, FolderKanban, Layers3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { deleteRoom, updateRoomTitle } from '~/app/actions/rooms';
import { cn } from '~/lib/utils';
import ConfirmationModal from './ConfirmationModal';

const ROOM_TONES = [
	'bg-[#dce6ef] text-[#1f2937]',
	'bg-[#e8e2f3] text-[#1f2937]',
	'bg-[#e3ece5] text-[#1f2937]',
	'bg-[#e7e9ee] text-[#1f2937]',
];

const ViewModeButton = ({ onSelect, active, text }: { onSelect: () => void; active: boolean; text: string }) => {
	return (
		<button
			type="button"
			onClick={onSelect}
			className={cn(
				'rounded-[0.45rem] border px-2.5 py-1 text-[11px] font-medium transition duration-200',
				active ? 'border-[#4f8cff] bg-[#295ba8] text-white' : 'border-white/15 bg-[#2a2a2a] text-[#b7b7b9]',
			)}
		>
			{text}
		</button>
	);
};

const SingleRoom = ({
	id,
	title,
	color,
	selected,
	select,
	navigateTo,
	canEdit,
}: {
	id: string;
	title: string;
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
		<div className="flex flex-col gap-2">
			<div
				className={cn(
					'rounded-[0.62rem] border bg-[#222222] p-[1px] transition duration-200',
					selected ? 'border-[#4f8cff] shadow-[0_0_0_1px_rgba(79,140,255,0.35)]' : 'border-white/10',
				)}
			>
				<button
					type="button"
					onDoubleClick={navigateTo}
					onClick={select}
					className={cn(
						'flex w-full cursor-pointer flex-col rounded-[calc(0.62rem-1px)] text-left transition duration-200 hover:brightness-105',
					)}
				>
					<div className={cn('rounded-t-[calc(0.62rem-1px)] px-4 pb-5 pt-4', color)}>
						<div className="space-y-1.5">
							<div className="inline-flex rounded-[0.35rem] border border-black/10 bg-white/60 px-2 py-0.5 text-[9px] uppercase tracking-[0.08em] text-[#445269]">
								{canEdit ? 'Owner room' : 'Shared with you'}
							</div>
							<h3 className="line-clamp-2 text-[25px] leading-[1.03] text-[#141a23]">{title}</h3>
						</div>
					</div>
					<div className="flex items-center justify-between rounded-b-[calc(0.62rem-1px)] border-t border-white/5 bg-[#262626] px-4 py-2.5 text-[10px] text-[#b5b5b7]">
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
							className="w-full rounded-[0.45rem] border border-white/15 bg-[#262626] px-2.5 py-1.5 text-[12px] font-medium text-white outline-none focus:border-[#4f8cff]"
						/>
					) : (
						<button
							type="button"
							onClick={() => canEdit && setIsEditing(true)}
							className="truncate text-left text-[12px] font-medium text-[#f4f4f5] transition hover:text-[#8eb5ff]"
						>
							{title}
						</button>
					)}
					<p className="mt-1 select-none text-[10px] text-[#9a9a9d]">
						Use the arrow button to open the editor.
					</p>
				</div>
				<button
					type="button"
					onClick={navigateTo}
					className="inline-flex h-7 w-7 items-center justify-center rounded-[0.45rem] border border-white/15 bg-[#2a2a2a] text-[#e5e7eb] transition hover:border-[#4f8cff] hover:text-[#8eb5ff]"
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
				<div className="flex gap-2">
					<ViewModeButton
						onSelect={() => setViewMode('owns')}
						active={viewMode === 'owns'}
						text="My project"
					/>
					<ViewModeButton
						onSelect={() => setViewMode('shared')}
						active={viewMode === 'shared'}
						text="Shared files"
					/>
				</div>
				<div className="flex items-center gap-2 rounded-[0.45rem] border border-white/15 bg-[#2a2a2a] px-2.5 py-1 text-[11px] text-[#b5b5b7]">
					<FolderKanban className="h-3.5 w-3.5" />
					<span>
						{filteredRooms.length} active room{filteredRooms.length === 1 ? '' : 's'}
					</span>
				</div>
			</div>
			{filteredRooms.length === 0 ? (
				<div className="rounded-[0.6rem] border border-white/10 bg-[#242424] px-6 py-10 text-center">
					<p className="text-[10px] uppercase tracking-[0.1em] text-[#9a9a9d]">
						No rooms yet
					</p>
					<h3 className="mt-2 text-[18px] text-[#f4f4f5]">
						{viewMode === 'owns'
							? 'Start your first design room.'
							: 'Nothing has been shared with you yet.'}
					</h3>
					<p className="mx-auto mt-2 max-w-lg text-[12px] leading-6 text-[#9a9a9d]">
						{viewMode === 'owns'
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
									id={room.id}
									title={room.title}
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
			)}
		</div>
	);
};

export default RoomsView;
