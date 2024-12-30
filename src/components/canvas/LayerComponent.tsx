import { useStorage } from '@liveblocks/react';
import { memo } from 'react';
import { LayerType } from '~/types';
import Ellipse from './Ellipse';
import PathLayerComponent from './PathLayerComponent';
import Rectangle from './Rectangle';
import Text from './Text';

const LayerComponent = memo(
	({ id, onLayerClick }: { id: string; onLayerClick: (e: React.PointerEvent, layerId: string) => void }) => {
		const layer = useStorage(storage => storage.layers.get(id));
		if (!layer) return null;

		switch (layer.type) {
			case LayerType.Rectangle:
				return <Rectangle id={id} layer={layer} onLayerClick={onLayerClick} />;
			case LayerType.Ellipse:
				return <Ellipse id={id} layer={layer} onLayerClick={onLayerClick} />;
			case LayerType.Path:
				return <PathLayerComponent {...layer} onPointerDown={e => onLayerClick(e, id)} />;
			case LayerType.Text:
				return <Text id={id} layer={layer} onLayerClick={onLayerClick} />;
			default:
				return null;
		}
	},
);

LayerComponent.displayName = 'LayerComponent';

export default LayerComponent;
