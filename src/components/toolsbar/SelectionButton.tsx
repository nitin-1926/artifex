'use client';

import { useEffect, useRef, useState } from 'react';
import { CanvasMode } from '~/types';
import IconButton from './IconButton';
import { BiChevronDown, BiPointer } from 'react-icons/bi';
import { RiHand } from 'react-icons/ri';

const SelectionButton = ({
	isActive,
	canvasMode,
	onClick,
}: {
	isActive: boolean;
	canvasMode: CanvasMode;
	onClick: (canvasMode: CanvasMode.None | CanvasMode.Dragging) => void;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const handleClick = (canvasMode: CanvasMode.None | CanvasMode.Dragging) => {
		onClick(canvasMode);
		setIsOpen(false);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div className="relative flex" ref={menuRef}>
			<IconButton
				onClick={() => onClick(CanvasMode.None)}
				isActive={isActive}
				disabled={false}
				label="Selection tools"
			>
				{canvasMode !== CanvasMode.None && canvasMode !== CanvasMode.Dragging && (
					<BiPointer className="h-5 w-5" />
				)}
				{canvasMode === CanvasMode.None && <BiPointer className="h-5 w-5" />}
				{canvasMode === CanvasMode.Dragging && <RiHand className="h-5 w-5" />}
			</IconButton>
			<button
				type="button"
				aria-label="Open selection tool menu"
				onClick={() => setIsOpen(!isOpen)}
				className="ml-1 rotate-180 rounded-[0.5rem] p-1 text-[#6b7280] transition hover:bg-[#eceef2] hover:text-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
			>
				<BiChevronDown className="h-5 w-5" />
			</button>
			{isOpen && (
				<div className="absolute -top-24 z-20 mt-1 flex min-w-[170px] flex-col gap-1 rounded-[0.75rem] border border-[#d7d8dc] bg-[#ffffff] p-1.5 shadow-[0_16px_36px_-28px_rgba(15,23,42,0.32)]">
					<button
						type="button"
						onClick={() => handleClick(CanvasMode.None)}
						className={`flex w-full items-center rounded-[0.6rem] px-2 py-2 text-[#374151] transition hover:bg-[#f3f4f6] ${
							canvasMode === CanvasMode.None ? 'bg-[#eaf2ff] text-[#2563eb]' : ''
						}`}
					>
						<span className="w-5 text-xs">{canvasMode === CanvasMode.None && '✓'}</span>
						<BiPointer className="mr-2 h-4 w-4" />
						<span className="text-xs">Move</span>
					</button>
					<button
						type="button"
						onClick={() => handleClick(CanvasMode.Dragging)}
						className={`flex w-full items-center rounded-[0.6rem] px-2 py-2 text-[#374151] transition hover:bg-[#f3f4f6] ${
							canvasMode === CanvasMode.Dragging ? 'bg-[#eaf2ff] text-[#2563eb]' : ''
						}`}
					>
						<span className="w-5 text-xs">{canvasMode === CanvasMode.Dragging && '✓'}</span>
						<RiHand className="mr-2 h-4 w-4" />
						<span className="text-xs">Hand tool</span>
					</button>
				</div>
			)}
		</div>
	);
};

export default SelectionButton;
