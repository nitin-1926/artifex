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
		<g>
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
