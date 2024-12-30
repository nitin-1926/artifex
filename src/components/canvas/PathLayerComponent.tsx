import { getStroke } from 'perfect-freehand';
import { type Color } from '~/types';
import { getSvgPathFromStroke, rgbToHex } from '~/utils';

const PathLayerComponent = ({
	x,
	y,
	stroke,
	fill,
	opacity,
	points,
	onPointerDown,
}: {
	x: number;
	y: number;
	stroke?: Color;
	fill: Color;
	opacity: number;
	points: number[][];
	onPointerDown?: (e: React.PointerEvent) => void;
}) => {
	const pathData = getSvgPathFromStroke(
		getStroke(points, {
			size: 16,
			thinning: 0.5,
			smoothing: 0.5,
			streamline: 0.5,
		}),
	);

	return (
		<path
			style={{
				transform: `translate(${x}px, ${y}px)`,
			}}
			d={pathData}
			fill={fill ? rgbToHex(fill) : '#ccc'}
			stroke={stroke ? rgbToHex(stroke) : '#ccc'}
			strokeWidth={1}
			opacity={`${opacity ?? 100}%`}
			onPointerDown={onPointerDown}
		/>
	);
};

export default PathLayerComponent;
