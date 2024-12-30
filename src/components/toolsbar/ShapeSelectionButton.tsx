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
			<IconButton onClick={() => onClick(LayerType.Rectangle)} isActive={isActive} disabled={false}>
				{canvasStates.mode !== CanvasMode.Inserting && <IoSquareOutline className="h-5 w-5" />}
				{canvasStates.mode === CanvasMode.Inserting &&
					(canvasStates.layerType === LayerType.Rectangle || canvasStates.layerType === LayerType.Text) && (
						<IoSquareOutline className="h-5 w-5" />
					)}
				{canvasStates.mode === CanvasMode.Inserting && canvasStates.layerType === LayerType.Ellipse && (
					<IoEllipseOutline className="h-5 w-5" />
				)}
			</IconButton>
			<button onClick={() => setIsOpen(!isOpen)} className="ml-1 rotate-180">
				<BiChevronDown className="h-5 w-5" />
			</button>
			{isOpen && (
				<div className="absolute -top-20 mt-1 min-w-[150px] rounded-xl bg-[#1e1e1e] p-2 shadow-lg flex flex-col gap-2 z-10">
					<button
						onClick={() => handleClick(LayerType.Rectangle)}
						className={`flex items-center w-full rounded-md p-1 text-white hover:bg-blue-500 ${
							canvasStates.mode === CanvasMode.Inserting && canvasStates.layerType === LayerType.Rectangle
								? 'bg-blue-500'
								: ''
						}`}
					>
						<span className="w-5 text-xs">
							{canvasStates.mode === CanvasMode.Inserting &&
								canvasStates.layerType === LayerType.Rectangle &&
								'✓'}
						</span>
						<IoSquareOutline className="mr-2 h-4 w-4" />
						<span className="text-xs">Rectangle</span>
					</button>
					<button
						onClick={() => handleClick(LayerType.Ellipse)}
						className={`flex items-center w-full rounded-md p-1 text-white hover:bg-blue-500 ${
							canvasStates.mode === CanvasMode.Inserting && canvasStates.layerType === LayerType.Ellipse
								? 'bg-blue-500'
								: ''
						}`}
					>
						<span className="w-5 text-xs">
							{canvasStates.mode === CanvasMode.Inserting &&
								canvasStates.layerType === LayerType.Ellipse &&
								'✓'}
						</span>
						<IoEllipseOutline className="mr-2 h-4 w-4" />
						<span className="text-xs">Ellipse</span>
					</button>
				</div>
			)}
		</div>
	);
};

export default ShapeSelectionButton;
