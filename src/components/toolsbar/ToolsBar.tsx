import { CanvasMode, LayerType, type CanvasStates } from '~/types';
import SelectionButton from './SelectionButton';
import ShapeSelectionButton from './ShapeSelectionButton';
import ZoomInButton from './ZoomInButton';
import ZoomOutButton from './ZoomOutButton';

const ToolsBar = ({
	canvasStates,
	setCanvasStates,
	zoomIn,
	zoomOut,
	canZoomIn,
	canZoomOut,
}: {
	canvasStates: CanvasStates;
	setCanvasStates: (newState: CanvasStates) => void;
	zoomIn: () => void;
	zoomOut: () => void;
	canZoomIn: boolean;
	canZoomOut: boolean;
}) => {
	return (
		<div className="fixed bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-lg bg-white p-2 shadow-[0_0_3px_rgba(0,0,0,0.18)]">
			<div className="flex items-center justify-center gap-3">
				<SelectionButton
					isActive={canvasStates.mode === CanvasMode.None || canvasStates.mode === CanvasMode.Dragging}
					canvasMode={canvasStates.mode}
					onClick={canvasMode =>
						setCanvasStates(
							canvasMode === CanvasMode.Dragging
								? { mode: canvasMode, origin: null }
								: { mode: canvasMode },
						)
					}
				/>
				<ShapeSelectionButton
					isActive={
						canvasStates.mode === CanvasMode.Inserting &&
						[LayerType.Rectangle, LayerType.Ellipse].includes(canvasStates.layerType)
					}
					canvasStates={canvasStates}
					onClick={layerType => setCanvasStates({ mode: CanvasMode.Inserting, layerType })}
				/>
				<div className="self-stretch">
					<div className="flex items-center justify-center">
						<ZoomInButton onClick={zoomIn} disabled={!canZoomIn} />
						<ZoomOutButton onClick={zoomOut} disabled={!canZoomOut} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ToolsBar;