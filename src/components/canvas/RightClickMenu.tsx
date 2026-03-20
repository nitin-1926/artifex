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
	const x = (bounds.width / 2 + bounds.x) * camera.zoom + camera.x;
	const y = (bounds.y + camera.y) * camera.zoom;

	return (
		<div
			style={{ transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%))` }}
			className="pointer-events-auto absolute flex min-w-[168px] flex-col rounded-[0.55rem] border border-[#3f3f42] bg-[#262628] p-1 shadow-[0_18px_36px_-28px_rgba(0,0,0,0.7)]"
		>
			<button
				type="button"
				onClick={bringToFront}
				className="flex w-full items-center justify-center gap-2 rounded-[0.45rem] px-2 py-1.5 text-[#d4d4d8] transition hover:bg-[#343436]"
			>
				<span className="text-[11px]">Bring to front</span>
				<BsArrowDown className="mr-2 h-3.5 w-3.5" />
			</button>
			<button
				type="button"
				onClick={sendToBack}
				className="flex w-full items-center justify-center gap-2 rounded-[0.45rem] px-2 py-1.5 text-[#d4d4d8] transition hover:bg-[#343436]"
			>
				<span className="text-[11px]">Send to back</span>
				<BsArrowUp className="mr-2 h-3.5 w-3.5" />
			</button>
		</div>
	);
});

RightClickMenu.displayName = 'RightClickMenu';

export default RightClickMenu;
