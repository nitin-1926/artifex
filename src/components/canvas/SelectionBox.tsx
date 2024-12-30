import { useSelf, useStorage } from '@liveblocks/react';
import { useEffect, useRef, useState } from 'react';
import { LayerType } from '~/types';

const handleWidth = 8;
const handleHeight = 8;

const SelectionBox = () => {
	const selectedLayerId = useSelf(self => (self.presence.selection.length === 1 ? self.presence.selection[0] : null));
	const isShowingHandles = useStorage(
		storage => selectedLayerId && storage.layers.get(selectedLayerId)?.type !== LayerType.Path,
	);
	const layers = useStorage(storage => storage.layers);
	const layer = selectedLayerId ? layers?.get(selectedLayerId) : null;
	const textRef = useRef<SVGTextElement>(null);
	const [textWidth, setTextWidth] = useState(0);
	const padding = 16;

	useEffect(() => {
		if (textRef.current) {
			const boundingBox = textRef.current.getBBox();
			setTextWidth(boundingBox.width);
		}
	}, [layer]);

	if (!layer) return null;

	return (
		<>
			<rect
				style={{ transform: `translate(${layer?.x}px, ${layer?.y}px)` }}
				className="pointer-events-none fill-transparent stroke-[#0b99ff] stroke-[1px]"
				width={layer?.width}
				height={layer?.height}
			/>
			<rect
				className="fill-[#0b99ff]"
				x={layer.x + (layer.width - textWidth - padding) / 2}
				y={layer.y + layer.height + 11}
				width={textWidth + padding}
				height={20}
				rx={4}
			/>
			<text
				ref={textRef}
				style={{ transform: `translate(${layer.x + layer.width / 2}px, ${layer.y + layer.height + 25}px)` }}
				className="pointer-events-none fill-white text-[11px]"
				textAnchor="middle"
			>
				{Math.round(layer.width)} x {Math.round(layer.height)}
			</text>
			{isShowingHandles && (
				<>
					<rect
						style={{
							cursor: 'nwse-resize',
							width: `${handleWidth}px`,
							height: `${handleHeight}px`,
							transform: `translate(${layer.x - handleWidth / 2}px, ${layer.y - handleHeight / 2}px)`,
						}}
						className="fill-white stroke-[#0b99ff] stroke-[1px]"
					/>
					<rect
						style={{
							cursor: 'ns-resize',
							width: `${handleWidth}px`,
							height: `${handleHeight}px`,
							transform: `translate(${layer.x + layer.width / 2 - handleWidth / 2}px, ${layer.y - handleHeight / 2}px)`,
						}}
						className="fill-white stroke-[#0b99ff] stroke-[1px]"
					/>
					<rect
						style={{
							cursor: 'nesw-resize',
							width: `${handleWidth}px`,
							height: `${handleHeight}px`,
							transform: `translate(${layer.x + layer.width - handleWidth / 2}px, ${layer.y - handleHeight / 2}px)`,
						}}
						className="fill-white stroke-[#0b99ff] stroke-[1px]"
					/>
					<rect
						style={{
							cursor: 'ew-resize',
							width: `${handleWidth}px`,
							height: `${handleHeight}px`,
							transform: `translate(${layer.x - handleWidth / 2}px, ${layer.y + layer.height / 2 - handleHeight / 2}px)`,
						}}
						className="fill-white stroke-[#0b99ff] stroke-[1px]"
					/>
					<rect
						style={{
							cursor: 'nesw-resize',
							width: `${handleWidth}px`,
							height: `${handleHeight}px`,
							transform: `translate(${layer.x - handleWidth / 2}px, ${layer.y + layer.height - handleHeight / 2}px)`,
						}}
						className="fill-white stroke-[#0b99ff] stroke-[1px]"
					/>
					<rect
						style={{
							cursor: 'ew-resize',
							width: `${handleWidth}px`,
							height: `${handleHeight}px`,
							transform: `translate(${layer.x + layer.width - handleWidth / 2}px, ${layer.y + layer.height / 2 - handleHeight / 2}px)`,
						}}
						className="fill-white stroke-[#0b99ff] stroke-[1px]"
					/>
					<rect
						style={{
							cursor: 'nwse-resize',
							width: `${handleWidth}px`,
							height: `${handleHeight}px`,
							transform: `translate(${layer.x + layer.width - handleWidth / 2}px, ${layer.y + layer.height - handleHeight / 2}px)`,
						}}
						className="fill-white stroke-[#0b99ff] stroke-[1px]"
					/>
					<rect
						style={{
							cursor: 'ns-resize',
							width: `${handleWidth}px`,
							height: `${handleHeight}px`,
							transform: `translate(${layer.x + layer.width / 2 - handleWidth / 2}px, ${layer.y + layer.height - handleHeight / 2}px)`,
						}}
						className="fill-white stroke-[#0b99ff] stroke-[1px]"
					/>
				</>
			)}
		</>
	);
};

export default SelectionBox;
