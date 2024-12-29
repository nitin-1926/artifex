'use client';

import { LiveList, LiveMap, type LiveObject } from '@liveblocks/client';
import { LiveblocksProvider, RoomProvider } from '@liveblocks/react';
import { type Layer } from '~/types';

const Room = ({ children, roomId }: { children: React.ReactNode; roomId: string }) => {
	return (
		<LiveblocksProvider authEndpoint={'/api/liveblocks-auth'}>
			<RoomProvider
				id={roomId}
				initialPresence={{
					selection: [],
					cursor: null,
					penColor: null,
					pencilDraft: null,
				}}
				initialStorage={{
					roomColor: { r: 30, g: 30, b: 30 },
					layers: new LiveMap<string, LiveObject<Layer>>(),
					layerIds: new LiveList([]),
				}}
			>
				{children}
			</RoomProvider>
		</LiveblocksProvider>
	);
};

export default Room;
