'use client';

import { LiveObject } from '@liveblocks/client';
import { useMutation, useStorage } from '@liveblocks/react';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { type Camera, type Layer, LayerType, type Point, type RectangleLayer } from '~/types';
import { pointerEventToCanvasPoint, rgbToHex } from '~/utils';
import LayerComponent from './LayerComponent';

const MAX_LAYERS = 100;

const Canvas = () => {
	const roomColor = useStorage(storage => storage.roomColor);
	const layerIds = useStorage(storage => storage.layerIds);
	const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, zoom: 1 });

	const insertLayer = useMutation(
		(
			{ storage, setMyPresence },
			layerType: LayerType.Rectangle | LayerType.Ellipse | LayerType.Text,
			position: Point,
		) => {
			const liveLayers = storage.get('layers');
			if (liveLayers.size >= MAX_LAYERS) {
				return;
			}

			const liveLayerIds = storage.get('layerIds');
			const layerId = nanoid();
			let layer: LiveObject<Layer> | null = null;

			if (layerType === LayerType.Rectangle) {
				layer = new LiveObject<RectangleLayer>({
					type: LayerType.Rectangle,
					x: position.x,
					y: position.y,
					width: 100,
					height: 100,
					fill: { r: 217, g: 217, b: 217 },
					stroke: { r: 217, g: 217, b: 217 },
					opacity: 100,
				});
			}

			if (layer) {
				liveLayerIds.push(layerId);
				liveLayers.set(layerId, layer);

				setMyPresence({ selection: [layerId] }, { addToHistory: true });
			}
		},
		[],
	);

	const handlePointerUp = useMutation(({ storage }, e: React.PointerEvent) => {
		const point = pointerEventToCanvasPoint(e, camera);
		insertLayer(LayerType.Rectangle, point);
	}, []);

	return (
		<div className="flex h-screen w-full">
			<main className="overflow-y-auto fixed left-0 right-0 h-screen">
				<div
					style={{ backgroundColor: roomColor ? rgbToHex(roomColor) : '#1e1e1e' }}
					className="h-full w-full touch-none"
				>
					<svg onPointerUp={handlePointerUp} className="h-full w-full">
						<g>{layerIds?.map(layerId => <LayerComponent key={layerId} id={layerId} />)}</g>
					</svg>
				</div>
			</main>
		</div>
	);
};

export default Canvas;
