'use client';

import { useEffect, useRef, useState } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import { IoEllipseOutline, IoSquareOutline } from 'react-icons/io5';
import { CanvasMode, type CanvasStates, LayerType } from '~/types';
import IconButton from './IconButton';

const ShapeSelectionButton = ({
	isActive,
	canvasStates,
	onClick,
}: {
	isActive: boolean;
	canvasStates: CanvasStates;
	onClick: (layerType: LayerType.Rectangle | LayerType.Ellipse) => void;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const handleClick = (layerType: LayerType.Rectangle | LayerType.Ellipse) => {
		onClick(layerType);
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
				onClick={() => onClick(LayerType.Rectangle)}
				isActive={isActive}
				disabled={false}
				label="Shape tools"
			>
				{canvasStates.mode !== CanvasMode.Inserting && <IoSquareOutline className="h-4 w-4" />}
				{canvasStates.mode === CanvasMode.Inserting &&
					(canvasStates.layerType === LayerType.Rectangle || canvasStates.layerType === LayerType.Text) && (
						<IoSquareOutline className="h-4 w-4" />
					)}
				{canvasStates.mode === CanvasMode.Inserting && canvasStates.layerType === LayerType.Ellipse && (
					<IoEllipseOutline className="h-4 w-4" />
				)}
			</IconButton>
			<button
				type="button"
				aria-label="Open shape tool menu"
				onClick={() => setIsOpen(!isOpen)}
				className="ml-1 rotate-180 rounded-[0.4rem] p-1 text-[#9ca3af] transition hover:bg-[#343436] hover:text-[#f4f4f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5d8dff]/45"
			>
				<BiChevronDown className="h-4 w-4" />
			</button>
			{isOpen && (
				<div className="absolute -top-24 z-20 mt-1 flex min-w-[164px] flex-col gap-1 rounded-[0.55rem] border border-[#3f3f42] bg-[#262628] p-1 shadow-[0_16px_36px_-28px_rgba(0,0,0,0.72)]">
					<button
						type="button"
						onClick={() => handleClick(LayerType.Rectangle)}
						className={`flex w-full items-center rounded-[0.45rem] px-2 py-1.5 text-[#d4d4d8] transition hover:bg-[#343436] ${
							canvasStates.mode === CanvasMode.Inserting && canvasStates.layerType === LayerType.Rectangle
								? 'bg-[#2f4773] text-[#d6e5ff]'
								: ''
						}`}
					>
						<span className="w-5 text-[10px]">
							{canvasStates.mode === CanvasMode.Inserting &&
								canvasStates.layerType === LayerType.Rectangle &&
								'✓'}
						</span>
						<IoSquareOutline className="mr-2 h-4 w-4" />
						<span className="text-[11px]">Rectangle</span>
					</button>
					<button
						type="button"
						onClick={() => handleClick(LayerType.Ellipse)}
						className={`flex w-full items-center rounded-[0.45rem] px-2 py-1.5 text-[#d4d4d8] transition hover:bg-[#343436] ${
							canvasStates.mode === CanvasMode.Inserting && canvasStates.layerType === LayerType.Ellipse
								? 'bg-[#2f4773] text-[#d6e5ff]'
								: ''
						}`}
					>
						<span className="w-5 text-[10px]">
							{canvasStates.mode === CanvasMode.Inserting &&
								canvasStates.layerType === LayerType.Ellipse &&
								'✓'}
						</span>
						<IoEllipseOutline className="mr-2 h-4 w-4" />
						<span className="text-[11px]">Ellipse</span>
					</button>
				</div>
			)}
		</div>
	);
};

export default ShapeSelectionButton;
