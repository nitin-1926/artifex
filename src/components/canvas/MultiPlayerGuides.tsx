import { shallow, useOthersConnectionIds, useOthersMapped } from '@liveblocks/react';
import { memo } from 'react';
import Cursor from './Cursor';
import PathLayerComponent from './PathLayerComponent';
import { rgbToHex } from '~/utils';

const Cursors = memo(() => {
	const ids = useOthersConnectionIds();
	return (
		<>
			{ids.map(connectionId => (
				<Cursor key={connectionId} connectionId={connectionId} />
			))}
		</>
	);
});

Cursors.displayName = 'Cursors';

const Drafts = memo(() => {
	const others = useOthersMapped(
		other => ({
			pencilDraft: other.presence.pencilDraft,
			penColor: other.presence.penColor,
		}),
		shallow,
	);

	return (
		<>
			{others.map(([key, other]) => {
				if (other.pencilDraft) {
					return (
						<PathLayerComponent
							key={key}
							x={0}
							y={0}
							points={other.pencilDraft}
							fill={other.penColor ?? { r: 217, g: 217, b: 217 }}
							opacity={100}
						/>
					);
				}
				return null;
			})}
		</>
	);
});

Drafts.displayName = 'Drafts';

const MultiplayerGuides = memo(() => {
	return (
		<>
			<Cursors />
			<Drafts />
		</>
	);
});

MultiplayerGuides.displayName = 'MultiplayerGuides';

export default MultiplayerGuides;
