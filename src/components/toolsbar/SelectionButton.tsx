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
			<IconButton onClick={() => onClick(CanvasMode.None)} isActive={isActive} disabled={false}>
				{canvasMode !== CanvasMode.None && canvasMode !== CanvasMode.Dragging && (
					<BiPointer className="h-5 w-5" />
				)}
				{canvasMode === CanvasMode.None && <BiPointer className="h-5 w-5" />}
				{canvasMode === CanvasMode.Dragging && <RiHand className="h-5 w-5" />}
			</IconButton>
			<button onClick={() => setIsOpen(!isOpen)} className="ml-1 rotate-180">
				<BiChevronDown className="h-5 w-5" />
			</button>
			{isOpen && (
				<div className="absolute -top-20 mt-1 min-w-[150px] rounded-xl bg-[#1e1e1e] p-2 shadow-lg flex flex-col gap-2 z-10">
					<button
						onClick={() => handleClick(CanvasMode.None)}
						className={`flex items-center w-full rounded-md p-1 text-white hover:bg-blue-500 ${
							canvasMode === CanvasMode.None ? 'bg-blue-500' : ''
						}`}
					>
						<span className="w-5 text-xs">{canvasMode === CanvasMode.None && '✓'}</span>
						<BiPointer className="mr-2 h-4 w-4" />
						<span className="text-xs">Move</span>
					</button>
					<button
						onClick={() => handleClick(CanvasMode.Dragging)}
						className={`flex items-center w-full rounded-md p-1 text-white hover:bg-blue-500 ${
							canvasMode === CanvasMode.Dragging ? 'bg-blue-500' : ''
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
