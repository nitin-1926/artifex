import { useSelf, useStorage } from '@liveblocks/react';
import { memo, useEffect, useRef, useState } from 'react';
import useSelectionBounds from '~/hooks/useSelectionBounds';
import { LayerType, Side, XYWH } from '~/types';

const handleWidth = 8;
const handleHeight = 8;

const SelectionBox = memo(({ onResize }: { onResize: (corner: Side, initialBounds: XYWH) => void }) => {
	const selectedLayerId = useSelf(self => (self.presence.selection.length === 1 ? self.presence.selection[0] : null));
	const isShowingHandles = useStorage(
		storage => selectedLayerId && storage.layers.get(selectedLayerId)?.type !== LayerType.Path,
	);
	const bounds = useSelectionBounds();
	const textRef = useRef<SVGTextElement>(null);
	const [textWidth, setTextWidth] = useState(0);
	const padding = 16;

	useEffect(() => {
		if (textRef.current) {
			const boundingBox = textRef.current.getBBox();
			setTextWidth(boundingBox.width);
		}
	}, [bounds]);

	if (!bounds) return null;

	return (
		<>
			<rect
				style={{ transform: `translate(${bounds.x}px, ${bounds.y}px)` }}
				className="pointer-events-none fill-transparent stroke-[#0b99ff] stroke-[1px]"
				width={bounds.width}
				height={bounds.height}
			/>
			<rect
				className="fill-[#0b99ff]"
				x={bounds.x + (bounds.width - textWidth - padding) / 2}
				y={bounds.y + bounds.height + 11}
				width={textWidth + padding}
				height={20}
				rx={4}
			/>
			<text
				ref={textRef}
				style={{ transform: `translate(${bounds.x + bounds.width / 2}px, ${bounds.y + bounds.height + 25}px)` }}
				className="pointer-events-none fill-white text-[11px]"
				textAnchor="middle"
			>
				{Math.round(bounds.width)} x {Math.round(bounds.height)}
			</text>
			{isShowingHandles && (
				<>
					<rect
						style={{
							cursor: 'nwse-resize',
							width: `${handleWidth}px`,
							height: `${handleHeight}px`,
							transform: `translate(${bounds.x - handleWidth / 2}px, ${bounds.y - handleHeight / 2}px)`,
						}}
						className="fill-white stroke-[#0b99ff] stroke-[1px]"
						onPointerDown={e => {
							e.stopPropagation();
							onResize(Side.Top + Side.Left, bounds);
						}}
					/>
					<rect
						style={{
							cursor: 'ns-resize',
							width: `${handleWidth}px`,
							height: `${handleHeight}px`,
							transform: `translate(${bounds.x + bounds.width / 2 - handleWidth / 2}px, ${bounds.y - handleHeight / 2}px)`,
						}}
						className="fill-white stroke-[#0b99ff] stroke-[1px]"
						onPointerDown={e => {
							e.stopPropagation();
							onResize(Side.Top, bounds);
						}}
					/>
					<rect
						style={{
							cursor: 'nesw-resize',
							width: `${handleWidth}px`,
							height: `${handleHeight}px`,
							transform: `translate(${bounds.x + bounds.width - handleWidth / 2}px, ${bounds.y - handleHeight / 2}px)`,
						}}
						className="fill-white stroke-[#0b99ff] stroke-[1px]"
						onPointerDown={e => {
							e.stopPropagation();
							onResize(Side.Top + Side.Right, bounds);
						}}
					/>
					<rect
						style={{
							cursor: 'ew-resize',
							width: `${handleWidth}px`,
							height: `${handleHeight}px`,
							transform: `translate(${bounds.x - handleWidth / 2}px, ${bounds.y + bounds.height / 2 - handleHeight / 2}px)`,
						}}
						className="fill-white stroke-[#0b99ff] stroke-[1px]"
						onPointerDown={e => {
							e.stopPropagation();
							onResize(Side.Left, bounds);
						}}
					/>
					<rect
						style={{
							cursor: 'nesw-resize',
							width: `${handleWidth}px`,
							height: `${handleHeight}px`,
							transform: `translate(${bounds.x - handleWidth / 2}px, ${bounds.y + bounds.height - handleHeight / 2}px)`,
						}}
						className="fill-white stroke-[#0b99ff] stroke-[1px]"
						onPointerDown={e => {
							e.stopPropagation();
							onResize(Side.Bottom + Side.Left, bounds);
						}}
					/>
					<rect
						style={{
							cursor: 'ew-resize',
							width: `${handleWidth}px`,
							height: `${handleHeight}px`,
							transform: `translate(${bounds.x + bounds.width - handleWidth / 2}px, ${bounds.y + bounds.height / 2 - handleHeight / 2}px)`,
						}}
						className="fill-white stroke-[#0b99ff] stroke-[1px]"
						onPointerDown={e => {
							e.stopPropagation();
							onResize(Side.Right, bounds);
						}}
					/>
					<rect
						style={{
							cursor: 'nwse-resize',
							width: `${handleWidth}px`,
							height: `${handleHeight}px`,
							transform: `translate(${bounds.x + bounds.width - handleWidth / 2}px, ${bounds.y + bounds.height - handleHeight / 2}px)`,
						}}
						className="fill-white stroke-[#0b99ff] stroke-[1px]"
						onPointerDown={e => {
							e.stopPropagation();
							onResize(Side.Bottom + Side.Right, bounds);
						}}
					/>
					<rect
						style={{
							cursor: 'ns-resize',
							width: `${handleWidth}px`,
							height: `${handleHeight}px`,
							transform: `translate(${bounds.x + bounds.width / 2 - handleWidth / 2}px, ${bounds.y + bounds.height - handleHeight / 2}px)`,
						}}
						className="fill-white stroke-[#0b99ff] stroke-[1px]"
						onPointerDown={e => {
							e.stopPropagation();
							onResize(Side.Bottom, bounds);
						}}
					/>
				</>
			)}
		</>
	);
});

SelectionBox.displayName = 'SelectionBox';

export default SelectionBox;
