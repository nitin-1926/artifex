'use client';

import { LiveList, LiveMap, type LiveObject } from '@liveblocks/client';
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from '@liveblocks/react';
import Image from 'next/image';
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
				<ClientSideSuspense
					fallback={
						<div className="bg-grid-mask flex h-screen flex-col items-center justify-center gap-3 bg-slate-950 text-white">
							<Image
								className="h-[50px] w-[50px] animate-bounce"
								src="/artifex-logo.ico"
								alt="Artifex"
								width={50}
								height={50}
							/>
							<h1 className="text-sm font-normal animate-pulse">Loading your artifact...</h1>
						</div>
					}
				>
					{children}
				</ClientSideSuspense>
			</RoomProvider>
		</LiveblocksProvider>
	);
};

export default Room;
