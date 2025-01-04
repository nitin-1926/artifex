import { useOthersConnectionIds } from '@liveblocks/react';
import { memo } from 'react';
import Cursor from './Cursor';

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

const MultiplayerGuides = memo(() => {
	return (
		<>
			<Cursors />
		</>
	);
});

MultiplayerGuides.displayName = 'MultiplayerGuides';

export default MultiplayerGuides;
