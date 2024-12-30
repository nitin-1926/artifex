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
		<g className="group">
			{/* Hover Border */}
			<path
				className="pointer-events-none opacity-0 group-hover:opacity-100"
				style={{
					transform: `translate(${x}px, ${y}px)`,
				}}
				d={pathData}
				fill="none"
				strokeWidth={4}
				stroke={'#0b99ff'}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>

			{/* Main Path */}
			<path
				d={pathData}
				style={{ transform: `translate(${x}px, ${y}px)` }}
				fill={fill ? rgbToHex(fill) : '#ccc'}
				stroke={stroke ? rgbToHex(stroke) : '#ccc'}
				strokeWidth={1}
				opacity={`${opacity ?? 100}%`}
				onPointerDown={onPointerDown}
			/>
		</g>
	);
};

export default PathLayerComponent;
