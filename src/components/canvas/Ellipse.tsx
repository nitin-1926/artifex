import { type EllipseLayer } from '~/types';
import { rgbToHex } from '~/utils';

const Ellipse = ({ id, layer }: { id: string; layer: EllipseLayer }) => {
	const { x, y, width, height, fill, stroke, opacity } = layer;
	return (
		<g>
			<ellipse
				style={{ transform: `translate(${x}px, ${y}px)` }}
				fill={fill ? rgbToHex(fill) : '#ccc'}
				stroke={stroke ? rgbToHex(stroke) : '#ccc'}
				cx={width / 2}
				cy={height / 2}
				rx={width / 2}
				ry={height / 2}
				strokeWidth={1}
				opacity={`${opacity ?? 100}%`}
			/>
		</g>
	);
};

export default Ellipse;
