import { shallow, useSelf } from '@liveblocks/react';
import { useStorage } from '@liveblocks/react';
import { Layer, XYWH } from '~/types';

const boundingBox = (layers: Layer[]): XYWH | null => {
	const first = layers[0];
	if (!first) return null;

	let left = first.x;
	let top = first.y;
	let right = first.x + first.width;
	let bottom = first.y + first.height;

	for (let i = 1; i < layers.length; i++) {
		const { x, y, width, height } = layers[i]!;
		left = Math.min(left, x);
		top = Math.min(top, y);
		right = Math.max(right, x + width);
		bottom = Math.max(bottom, y + height);
	}

	return { x: left, y: top, width: right - left, height: bottom - top };
};

const useSelectionBounds = () => {
	const selection = useSelf(self => self.presence.selection);
	return useStorage(storage => {
		const selectedLayers = selection?.map(id => storage.layers.get(id)!).filter(Boolean);

		return boundingBox(selectedLayers ?? []);
	}, shallow);
};

export default useSelectionBounds;
