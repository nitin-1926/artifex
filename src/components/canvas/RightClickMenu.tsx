import { useMutation, useSelf } from '@liveblocks/react';
import { memo } from 'react';
import { BsArrowDown, BsArrowUp } from 'react-icons/bs';
import useSelectionBounds from '~/hooks/useSelectionBounds';
import { type Camera } from '~/types';

const RightClickMenu = memo(({ camera }: { camera: Camera }) => {
	const bounds = useSelectionBounds();
	const selection = useSelf(self => self.presence.selection);

	const bringToFront = useMutation(
		({ storage }) => {
			const liveLayerIds = storage.get('layerIds');
			const indices: number[] = [];

			const arr = liveLayerIds.toArray();
			for (let i = 0; i < arr.length; i++) {
				const element = arr[i];
				if (element !== undefined && selection?.includes(element)) {
					indices.push(i);
				}
			}
			for (let i = indices.length - 1; i >= 0; i--) {
				const element = indices[i];
				if (element !== undefined) {
					liveLayerIds.move(element, arr.length - 1 - (indices.length - 1 - i));
				}
			}
		},
		[selection],
	);

	const sendToBack = useMutation(
		({ storage }) => {
			const liveLayerIds = storage.get('layerIds');
			const indices: number[] = [];

			const arr = liveLayerIds.toArray();
			for (let i = 0; i < arr.length; i++) {
				const element = arr[i];
				if (element !== undefined && selection?.includes(element)) {
					indices.push(i);
				}
			}
			for (let i = 0; i < indices.length; i++) {
				const element = indices[i];
				if (element !== undefined) {
					liveLayerIds.move(element, i);
				}
			}
		},
		[selection],
	);

	if (!bounds) return null;
	const x = bounds.width / 2 + bounds.x + camera.x;
	const y = bounds.y + camera.y;

	return (
		<div
			style={{ transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%))` }}
			className="absolute flex min-w-[150px] flex-col rounded-xl bg-[#1e1e1e] p-2"
		>
			<button
				onClick={bringToFront}
				className="flex w-full items-center justify-center rounded-md px-1 py-1 gap-2 text-white hover:bg-blue-500"
			>
				<span className="text-xs">Bring to front</span>
				<BsArrowDown className="mr-2 h-4 w-4" />
			</button>
			<button
				onClick={sendToBack}
				className="flex w-full items-center justify-center rounded-md px-1 py-1 gap-2 text-white hover:bg-blue-500"
			>
				<span className="text-xs">Send to back</span>
				<BsArrowUp className="mr-2 h-4 w-4" />
			</button>
		</div>
	);
});

RightClickMenu.displayName = 'RightClickMenu';

export default RightClickMenu;
