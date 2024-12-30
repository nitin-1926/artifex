import { type RectangleLayer } from '~/types';
import { rgbToHex } from '~/utils';

const Rectangle = ({
	id,
	layer,
	onLayerClick,
}: {
	id: string;
	layer: RectangleLayer;
	onLayerClick: (e: React.PointerEvent, layerId: string) => void;
}) => {
	const { x, y, width, height, fill, stroke, opacity, cornerRadius } = layer;
	return (
		<g className="group">
			{/* Hover Border */}
			<rect
				className="pointer-events-none opacity-0 group-hover:opacity-100"
				style={{ transform: `translate(${x}px, ${y}px)` }}
				width={width}
				height={height}
				fill="none"
				strokeWidth={4}
				stroke={'#0b99ff'}
			/>

			{/* Main Rectangle */}
			<rect
				style={{ transform: `translate(${x}px, ${y}px)` }}
				width={width}
				height={height}
				fill={fill ? rgbToHex(fill) : '#ccc'}
				strokeWidth={1}
				stroke={stroke ? rgbToHex(stroke) : '#ccc'}
				opacity={`${opacity ?? 100}%`}
				rx={cornerRadius ?? 0}
				ry={cornerRadius ?? 0}
				onPointerDown={e => onLayerClick(e, id)}
			/>
		</g>
	);
};

export default Rectangle;
