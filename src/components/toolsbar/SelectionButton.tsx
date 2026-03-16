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
					<BiPointer className="h-4 w-4" />
				)}
				{canvasMode === CanvasMode.None && <BiPointer className="h-4 w-4" />}
				{canvasMode === CanvasMode.Dragging && <RiHand className="h-4 w-4" />}
			</IconButton>
			<button
				type="button"
				aria-label="Open selection tool menu"
				onClick={() => setIsOpen(!isOpen)}
				className="ml-1 rotate-180 rounded-[0.4rem] p-1 text-[#9ca3af] transition hover:bg-[#343436] hover:text-[#f4f4f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5d8dff]/45"
			>
				<BiChevronDown className="h-4 w-4" />
			</button>
			{isOpen && (
				<div className="absolute -top-24 z-20 mt-1 flex min-w-[164px] flex-col gap-1 rounded-[0.55rem] border border-[#3f3f42] bg-[#262628] p-1 shadow-[0_16px_36px_-28px_rgba(0,0,0,0.72)]">
					<button
						type="button"
						onClick={() => handleClick(CanvasMode.None)}
						className={`flex w-full items-center rounded-[0.45rem] px-2 py-1.5 text-[#d4d4d8] transition hover:bg-[#343436] ${
							canvasMode === CanvasMode.None ? 'bg-[#2f4773] text-[#d6e5ff]' : ''
						}`}
					>
						<span className="w-5 text-[10px]">{canvasMode === CanvasMode.None && '✓'}</span>
						<BiPointer className="mr-2 h-4 w-4" />
						<span className="text-[11px]">Move</span>
					</button>
					<button
						type="button"
						onClick={() => handleClick(CanvasMode.Dragging)}
						className={`flex w-full items-center rounded-[0.45rem] px-2 py-1.5 text-[#d4d4d8] transition hover:bg-[#343436] ${
							canvasMode === CanvasMode.Dragging ? 'bg-[#2f4773] text-[#d6e5ff]' : ''
						}`}
					>
						<span className="w-5 text-[10px]">{canvasMode === CanvasMode.Dragging && '✓'}</span>
						<RiHand className="mr-2 h-4 w-4" />
						<span className="text-[11px]">Hand tool</span>
					</button>
				</div>
			)}
		</div>
	);
};

export default SelectionButton;
