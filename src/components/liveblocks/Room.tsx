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
					roomColor: { r: 236, g: 237, b: 240 },
					layers: new LiveMap<string, LiveObject<Layer>>(),
					layerIds: new LiveList([]),
				}}
			>
				<ClientSideSuspense
					fallback={
						<div className="flex h-screen flex-col items-center justify-center gap-3 bg-[#1f1f1f] text-white">
							<Image
								className="h-[50px] w-[50px] animate-bounce"
								src="/artifex-logo.ico"
								alt="Artifex"
								width={50}
								height={50}
							/>
							<h1 className="animate-pulse text-[11px] font-normal tracking-[0.18em] text-slate-300 uppercase">
								Loading your artifact
							</h1>
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
