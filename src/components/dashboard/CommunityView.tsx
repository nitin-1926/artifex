'use client';

import { ArrowUpRight, Globe2, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { type RoomCardData } from './types';

const CommunityView = ({ rooms, currentUserId }: { rooms: RoomCardData[]; currentUserId: string }) => {
	const router = useRouter();
	const [query, setQuery] = useState('');

	const filtered = useMemo(() => {
		const normalized = query.trim().toLowerCase();
		if (!normalized) return rooms;
		return rooms.filter(room => room.title.toLowerCase().includes(normalized));
	}, [query, rooms]);

	const suggestions = useMemo(() => rooms.map(room => room.title), [rooms]);

	return (
		<div className="flex flex-col gap-5">
			<div className="rounded-[0.55rem] border border-border bg-card p-3">
				<label className="mb-2 block text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
					Search public designs
				</label>
				<div className="relative">
					<Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
					<input
						value={query}
						onChange={e => setQuery(e.target.value)}
						list="community-room-suggestions"
						placeholder="Start typing a room name"
						className="figma-control w-full pl-9 text-[12px]"
					/>
					<datalist id="community-room-suggestions">
						{suggestions.map(suggestion => (
							<option key={suggestion} value={suggestion} />
						))}
					</datalist>
				</div>
			</div>
			{filtered.length === 0 ? (
				<div className="rounded-[0.6rem] border border-border bg-card px-6 py-10 text-center">
					<p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">No public designs</p>
					<p className="mt-2 text-[13px] text-muted-foreground">Try another name in search.</p>
				</div>
			) : (
				<div className="grid gap-4 xl:grid-cols-3">
					{filtered.map(room => (
						<article key={room.id} className="group rounded-[0.62rem] border border-border bg-card p-3">
							<div className="rounded-[0.5rem] border border-border bg-muted/50 p-3">
								<div className="flex items-center justify-between gap-2">
									<div className="inline-flex items-center gap-1 rounded-[0.35rem] border border-border bg-background px-2 py-0.5 text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
										<Globe2 className="h-3 w-3" />
										Public
									</div>
									<button
										type="button"
										className="inline-flex h-7 w-7 items-center justify-center rounded-[0.45rem] border border-border bg-background text-muted-foreground transition hover:border-primary/45 hover:text-primary"
										onClick={() => router.push('/dashboard/' + room.id)}
										aria-label={`Open ${room.title}`}
									>
										<ArrowUpRight className="h-3.5 w-3.5" />
									</button>
								</div>
								<h3 className="mt-3 line-clamp-2 text-[20px] leading-tight text-foreground">{room.title}</h3>
								<p className="mt-2 line-clamp-2 text-[12px] text-muted-foreground">{room.description}</p>
							</div>
							<div className="mt-2 text-[11px] text-muted-foreground">
								By {room.owner.email} {room.ownerId === currentUserId ? '(you)' : ''}
							</div>
						</article>
					))}
				</div>
			)}
		</div>
	);
};

export default CommunityView;
