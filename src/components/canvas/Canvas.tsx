'use client';

import { LiveObject } from '@liveblocks/client';
import { useCanRedo, useCanUndo, useHistory, useMutation, useSelf, useStorage } from '@liveblocks/react';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useState } from 'react';
import {
	type Camera,
	CanvasMode,
	type CanvasStates,
	type EllipseLayer,
	type Layer,
	LayerType,
	type PathLayer,
	type Point,
	type RectangleLayer,
	Side,
	type TextLayer,
	XYWH,
} from '~/types';
import {
	findIntersectingLayers,
	penPointsToPathLayer,
	pointerEventToCanvasPoint,
	resizeBounds,
	rgbToHex,
} from '~/utils';
import ToolsBar from '../toolsbar/ToolsBar';
import LayerComponent from './LayerComponent';
import PathLayerComponent from './PathLayerComponent';
import SelectionBox from './SelectionBox';
import useDeleteLayers from '~/hooks/useDeleteLayers';

const MAX_LAYERS = 100;

const Canvas = () => {
	const roomColor = useStorage(storage => storage.roomColor);
	const layerIds = useStorage(storage => storage.layerIds);
	const pencilDraft = useSelf(self => self.presence.pencilDraft);
	const history = useHistory();
	const canUndo = useCanUndo();
	const canRedo = useCanRedo();
	const deleteLayers = useDeleteLayers();

	const [canvasStates, setCanvasStates] = useState<CanvasStates>({ mode: CanvasMode.None });
	const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, zoom: 1 });
	const [isDragging, setIsDragging] = useState(false);

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
			} else if (layerType === LayerType.Ellipse) {
				layer = new LiveObject<EllipseLayer>({
					type: LayerType.Ellipse,
					x: position.x,
					y: position.y,
					width: 100,
					height: 100,
					fill: { r: 217, g: 217, b: 217 },
					stroke: { r: 217, g: 217, b: 217 },
					opacity: 100,
				});
			} else if (layerType === LayerType.Text) {
				layer = new LiveObject<TextLayer>({
					type: LayerType.Text,
					x: position.x,
					y: position.y,
					width: 100,
					height: 100,
					text: 'Enter Text',
					fontSize: 20,
					fontFamily: 'Inter',
					fontWeight: 400,
					fill: { r: 217, g: 217, b: 217 },
					stroke: { r: 217, g: 217, b: 217 },
					opacity: 100,
				});
			}

			if (layer) {
				liveLayerIds.push(layerId);
				liveLayers.set(layerId, layer);

				setMyPresence({ selection: [layerId] }, { addToHistory: true });
				setCanvasStates({ mode: CanvasMode.None });
			}
		},
		[],
	);

	const insertPath = useMutation(
		({ storage, self, setMyPresence }) => {
			const liveLayers = storage.get('layers');
			const { pencilDraft } = self.presence;

			if (pencilDraft === null || pencilDraft.length < 3 || liveLayers.size >= MAX_LAYERS) {
				setMyPresence({ pencilDraft: null });
				return;
			}

			const pathId = nanoid();
			liveLayers.set(
				pathId,
				new LiveObject<PathLayer>(penPointsToPathLayer(pencilDraft, { r: 217, g: 217, b: 217 })),
			);

			const liveLayerIds = storage.get('layerIds');
			liveLayerIds.push(pathId);

			setMyPresence({ pencilDraft: null });
			setCanvasStates({ mode: CanvasMode.Pencil });
		},
		[setCanvasStates],
	);

	const handleResize = useCallback(
		(corner: Side, initialBounds: XYWH) => {
			history.pause();
			setCanvasStates({ mode: CanvasMode.Resizing, initialBounds, corner });
		},
		[setCanvasStates, history],
	);

	const resizeSelectedLayer = useMutation(
		({ storage, self }, point: Point) => {
			if (canvasStates.mode !== CanvasMode.Resizing) return;
			const bounds = resizeBounds(canvasStates.initialBounds, canvasStates.corner, point);
			const liveLayers = storage.get('layers');
			if (self.presence.selection.length > 0) {
				const layer = liveLayers.get(self.presence.selection[0]!);
				if (layer) {
					layer.update(bounds);
				}
			}
		},
		[canvasStates],
	);

	const startDrawing = useMutation(
		({ setMyPresence }, point: Point, pressure: number) => {
			setMyPresence({
				pencilDraft: [[point.x, point.y, pressure]],
				penColor: { r: 217, g: 217, b: 217 },
			});
		},
		[camera],
	);

	const continueDrawing = useMutation(
		({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
			const { pencilDraft } = self.presence;
			if (canvasStates.mode !== CanvasMode.Pencil || e.buttons !== 1 || pencilDraft === null) {
				return;
			}
			setMyPresence({ pencilDraft: [...pencilDraft, [point.x, point.y, e.pressure]] });
		},
		[canvasStates.mode],
	);

	const handleLayerSelection = useMutation(
		({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
			if (canvasStates.mode === CanvasMode.Pencil || canvasStates.mode === CanvasMode.Inserting) return;
			history.pause();
			e.stopPropagation();
			if (!self.presence.selection.includes(layerId)) {
				setMyPresence({ selection: [layerId] });
			}
			setCanvasStates({ mode: CanvasMode.Translating, current: pointerEventToCanvasPoint(e, camera) });
		},
		[camera, canvasStates.mode, setCanvasStates, history],
	);

	const unselectLayers = useMutation(({ self, setMyPresence }) => {
		if (self.presence.selection.length > 0) {
			setMyPresence({ selection: [] }, { addToHistory: true });
		}
	}, []);

	const translateSelectedLayer = useMutation(
		({ storage, self }, point: Point) => {
			if (canvasStates.mode !== CanvasMode.Translating) return;
			const offset = {
				x: point.x - canvasStates.current.x,
				y: point.y - canvasStates.current.y,
			};
			const liveLayers = storage.get('layers');
			if (self.presence.selection.length > 0) {
				for (const layerId of self.presence.selection) {
					const layer = liveLayers.get(layerId);
					if (layer) {
						layer.update({ x: layer.get('x') + offset.x, y: layer.get('y') + offset.y });
					}
				}
			}
			setCanvasStates({ mode: CanvasMode.Translating, current: point });
		},
		[canvasStates, setCanvasStates],
	);

	const startMultiSelection = useCallback(
		(point: Point, origin: Point) => {
			if (Math.abs(point.x - origin.x) + Math.abs(point.y - origin.y) < 5) {
				return;
			}
			setCanvasStates({ mode: CanvasMode.SelectionNet, origin, current: point });
		},
		[setCanvasStates],
	);

	const updateSelectionNet = useMutation(
		({ storage, setMyPresence }, current: Point, origin: Point) => {
			if (layerIds) {
				const layers = storage.get('layers').toImmutable();
				setCanvasStates({ mode: CanvasMode.SelectionNet, origin, current });
				const ids = findIntersectingLayers(layerIds, layers, origin, current);
				setMyPresence({ selection: ids });
			}
		},
		[layerIds, setCanvasStates],
	);

	const handlePointerUp = useMutation(
		({ storage }, e: React.PointerEvent) => {
			const point = pointerEventToCanvasPoint(e, camera);
			if (canvasStates.mode === CanvasMode.None || canvasStates.mode === CanvasMode.Pressing) {
				unselectLayers();
				setCanvasStates({ mode: CanvasMode.None });
			} else if (canvasStates.mode === CanvasMode.Inserting) {
				insertLayer(canvasStates.layerType, point);
			} else if (canvasStates.mode === CanvasMode.Dragging) {
				setCanvasStates({ mode: CanvasMode.Dragging, origin: null });
			} else if (canvasStates.mode === CanvasMode.Pencil) {
				insertPath();
			} else {
				setCanvasStates({ mode: CanvasMode.None });
			}
			setIsDragging(false);
			history.resume();
		},
		[camera, canvasStates, insertLayer, setCanvasStates, insertPath, setIsDragging, unselectLayers, history],
	);

	const handleWheel = useCallback((e: React.WheelEvent) => {
		setCamera(prevCamera => ({
			...prevCamera,
			x: prevCamera.x - e.deltaX,
			y: prevCamera.y - e.deltaY,
		}));
	}, []);

	const handlePointerDown = useMutation(
		({ storage }, e: React.PointerEvent) => {
			const point = pointerEventToCanvasPoint(e, camera);
			if (canvasStates.mode === CanvasMode.Dragging) {
				setCanvasStates({ mode: CanvasMode.Dragging, origin: point });
				setIsDragging(true);
				return;
			}
			if (canvasStates.mode === CanvasMode.Pencil) {
				startDrawing(point, e.pressure);
				return;
			}
			setCanvasStates({ mode: CanvasMode.Pressing, origin: point });
		},
		[camera, canvasStates.mode, setCanvasStates, setIsDragging, startDrawing],
	);

	const handlePointerMove = useMutation(
		({ storage }, e: React.PointerEvent) => {
			const point = pointerEventToCanvasPoint(e, camera);
			if (canvasStates.mode === CanvasMode.Pressing) {
				startMultiSelection(point, canvasStates.origin);
			} else if (canvasStates.mode === CanvasMode.SelectionNet) {
				updateSelectionNet(point, canvasStates.origin);
			}
			if (canvasStates.mode === CanvasMode.Dragging && canvasStates.origin !== null) {
				const deltaX = e.movementX;
				const deltaY = e.movementY;
				setCamera(prevCamera => ({
					...prevCamera,
					x: prevCamera.x + deltaX,
					y: prevCamera.y + deltaY,
				}));
			} else if (canvasStates.mode === CanvasMode.Pencil) {
				continueDrawing(point, e);
			} else if (canvasStates.mode === CanvasMode.Resizing) {
				resizeSelectedLayer(point);
			} else if (canvasStates.mode === CanvasMode.Translating) {
				translateSelectedLayer(point);
			}
		},
		[
			camera,
			canvasStates,
			setCamera,
			continueDrawing,
			resizeSelectedLayer,
			translateSelectedLayer,
			updateSelectionNet,
		],
	);

	const getCursor = () => {
		if (canvasStates.mode === CanvasMode.None) {
			return 'default';
		}
		if (canvasStates.mode === CanvasMode.Dragging) {
			return isDragging ? 'grabbing' : 'grab';
		}
		if (canvasStates.mode === CanvasMode.Pencil) {
			// TODO: Implement custom pencil cursor
			return 'pencil';
		}
	};

	// Keyboard shortcuts
	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			const activeElement = document.activeElement;
			const isInputField =
				activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');
			if (isInputField) return;

			switch (e.key) {
				case 'Backspace':
					deleteLayers();
					break;
			}
		};

		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, [deleteLayers]);

	return (
		<div className="flex h-screen w-full">
			<main className="overflow-y-auto fixed left-0 right-0 h-screen">
				<div
					style={{ backgroundColor: roomColor ? rgbToHex(roomColor) : '#1e1e1e' }}
					className={`h-full w-full touch-none cursor-${getCursor()}`}
				>
					<svg
						onWheel={handleWheel}
						onPointerUp={handlePointerUp}
						onPointerDown={handlePointerDown}
						onPointerMove={handlePointerMove}
						className="h-full w-full"
					>
						<g style={{ transform: `scale(${camera.zoom}) translate(${camera.x}px, ${camera.y}px)` }}>
							{layerIds?.map(layerId => (
								<LayerComponent key={layerId} id={layerId} onLayerClick={handleLayerSelection} />
							))}
							<SelectionBox onResize={handleResize} />
							{canvasStates.mode === CanvasMode.SelectionNet && canvasStates.current != null && (
								<rect
									className="fill-blue-600/5 stroke-blue-600 stroke-[0.5]"
									x={Math.min(canvasStates.origin.x, canvasStates.current.x)}
									y={Math.min(canvasStates.origin.y, canvasStates.current.y)}
									width={Math.abs(canvasStates.origin.x - canvasStates.current.x)}
									height={Math.abs(canvasStates.origin.y - canvasStates.current.y)}
								/>
							)}
							{pencilDraft !== null && pencilDraft.length > 0 && (
								<PathLayerComponent
									x={0}
									y={0}
									fill={{
										r: 217,
										g: 217,
										b: 217,
									}}
									opacity={100}
									points={pencilDraft}
								/>
							)}
						</g>
					</svg>
				</div>
			</main>
			<ToolsBar
				canvasStates={canvasStates}
				setCanvasStates={newState => setCanvasStates(newState)}
				zoomIn={() => {
					setCamera(prevCamera => ({ ...prevCamera, zoom: prevCamera.zoom + 0.1 }));
				}}
				zoomOut={() => {
					setCamera(prevCamera => ({ ...prevCamera, zoom: prevCamera.zoom - 0.1 }));
				}}
				canZoomIn={camera.zoom < 2}
				canZoomOut={camera.zoom > 0.5}
				undo={() => {
					history.undo();
				}}
				redo={() => {
					history.redo();
				}}
				canUndo={canUndo}
				canRedo={canRedo}
			/>
		</div>
	);
};

export default Canvas;
