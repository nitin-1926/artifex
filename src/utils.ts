import { type Camera, type Color, type PathLayer, type Point, LayerType, Side, XYWH } from './types';

export const rgbToHex = (color: Color): string => {
	return `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`;
};

export const pointerEventToCanvasPoint = (e: React.PointerEvent, camera: Camera): Point => {
	return {
		x: Math.round(e.clientX) - camera.x,
		y: Math.round(e.clientY) - camera.y,
	};
};

export const penPointsToPathLayer = (points: number[][], penColor: Color): PathLayer => {
	let left = Number.POSITIVE_INFINITY;
	let top = Number.POSITIVE_INFINITY;
	let right = Number.NEGATIVE_INFINITY;
	let bottom = Number.NEGATIVE_INFINITY;

	for (const point of points) {
		const [x, y] = point;
		if (x === undefined || y === undefined) continue;

		left = Math.min(left, x);
		top = Math.min(top, y);
		right = Math.max(right, x);
		bottom = Math.max(bottom, y);
	}

	return {
		type: LayerType.Path,
		x: left,
		y: top,
		width: right - left,
		height: bottom - top,
		fill: penColor,
		stroke: penColor,
		opacity: 100,
		points: points
			.filter(
				(point): point is [number, number, number] =>
					point[0] !== undefined && point[1] !== undefined && point[2] !== undefined,
			)
			.map(([x, y, pressure]) => [x - left, y - top, pressure]),
	};
};

export const getSvgPathFromStroke = (stroke: number[][]) => {
	if (!stroke.length) return '';

	const d = stroke.reduce(
		(acc, [x0, y0], i, arr) => {
			const nextPoint = arr[(i + 1) % arr.length];
			if (!nextPoint) return acc;
			const [x1, y1] = nextPoint;
			acc.push(x0!, y0!, (x0! + x1!) / 2, (y0! + y1!) / 2);
			return acc;
		},
		['M', ...(stroke[0] ?? []), 'Q'],
	);

	d.push('Z');
	return d.join(' ');
};

export const resizeBounds = (initialBounds: XYWH, corner: Side, point: Point): XYWH => {
	const result = {
		x: initialBounds.x,
		y: initialBounds.y,
		width: initialBounds.width,
		height: initialBounds.height,
	};

	if (corner === Side.Left || (corner & Side.Left) !== 0) {
		result.x = Math.min(point.x, initialBounds.x + initialBounds.width);
		result.width = Math.abs(initialBounds.x + initialBounds.width - point.x);
	}
	if (corner === Side.Right || (corner & Side.Right) !== 0) {
		result.x = Math.min(point.x, initialBounds.x);
		result.width = Math.abs(point.x - initialBounds.x);
	}
	if (corner === Side.Top || (corner & Side.Top) !== 0) {
		result.y = Math.min(point.y, initialBounds.y + initialBounds.height);
		result.height = Math.abs(initialBounds.y + initialBounds.height - point.y);
	}
	if (corner === Side.Bottom || (corner & Side.Bottom) !== 0) {
		result.y = Math.min(point.y, initialBounds.y);
		result.height = Math.abs(point.y - initialBounds.y);
	}

	return result;
};
