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
		<div className="flex flex-col gap-0.5">
			<div
				onDoubleClick={navigateTo}
				onClick={select}
				style={{ backgroundColor: color }}
				className={`flex h-56 w-96 cursor-pointer items-center justify-center rounded-md ${selected ? 'border-2 border-blue-500' : 'border border-[#e8e8e8]'}`}
			>
				<p className="text-md select-none font-medium">{title}</p>
			</div>
			{isEditing && canEdit ? (
				<input
					type="text"
					value={editedTitle}
					onChange={e => setEditedTitle(e.target.value)}
					onBlur={handleBlur}
					onKeyPress={handleKeyPress}
					autoFocus
					className="w-full"
				/>
			) : (
				<p onClick={() => setIsEditing(true)} className="mt-2 select-none text-[13px] font-medium">
					{title}
				</p>
			)}
			<p className="select-none text-[10px] text-gray-400">{description}</p>
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
