import { useOther } from '@liveblocks/react/suspense';
import { memo } from 'react';
import { connectionIdToColor } from '../../utils';

const Cursor = memo(({ connectionId }: { connectionId: number }) => {
	const cursor = useOther(connectionId, user => user.presence.cursor);
	if (!cursor) {
		return null;
	}

	const { x, y } = cursor;
	return (
		<path
			style={{
				transform: `translateX(${x}px) translateY(${y}px)`,
			}}
			d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
			fill={connectionIdToColor(connectionId)}
		/>
	);
});

Cursor.displayName = 'Cursor';

export default Cursor;
