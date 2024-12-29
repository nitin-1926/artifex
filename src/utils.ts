import { type Camera, type Color, type Point } from './types';

export const rgbToHex = (color: Color) => {
	return `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`;
};

export const pointerEventToCanvasPoint = (e: React.PointerEvent, camera: Camera): Point => {
	return {
		x: Math.round(e.clientX) - camera.x,
		y: Math.round(e.clientY) - camera.y,
	};
};
