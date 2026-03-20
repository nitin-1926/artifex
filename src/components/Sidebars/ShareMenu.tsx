import { RoomVisibility, type User } from '@prisma/client';
import { Check, Link2, Send, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { deleteRoomInvite, shareRoom } from '~/app/actions/rooms';
import UserAvatar from './UserAvatar';

const ShareMenu = ({
	roomId,
	roomName,
	owner,
	roomVisibility,
	othersWithAccessToRoom,
	triggerLabel = 'Share',
	triggerClassName,
}: {
	roomId: string;
	roomName: string;
	owner: Pick<User, 'id' | 'name' | 'email'>;
	roomVisibility: RoomVisibility;
	othersWithAccessToRoom: Array<Pick<User, 'id' | 'name' | 'email'>>;
	triggerLabel?: React.ReactNode;
	triggerClassName?: string;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [email, setEmail] = useState('');
	const [error, setError] = useState<string | undefined>(undefined);
	const [copied, setCopied] = useState(false);

	const roomLink = useMemo(() => {
		if (typeof window === 'undefined') return `/dashboard/${roomId}`;
		return `${window.location.origin}/dashboard/${roomId}`;
	}, [roomId]);

	const inviteUser = async () => {
		const inviteError = await shareRoom(roomId, email);
		setError(inviteError);
		if (!inviteError) {
			setEmail('');
		}
	};

	const copyLink = async () => {
		await navigator.clipboard.writeText(roomLink);
		setCopied(true);
		setTimeout(() => setCopied(false), 1600);
	};

	return (
		<div>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className={
					triggerClassName ??
					'rounded-[0.45rem] border border-border/80 bg-background px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-foreground/80 transition hover:border-primary/50 hover:text-primary'
				}
			>
				{triggerLabel}
			</button>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
					<div className="flex w-full max-w-[450px] flex-col overflow-hidden rounded-[0.65rem] border border-border bg-card shadow-[0_30px_80px_-36px_rgba(15,23,42,0.65)]">
						<div className="flex items-center justify-between border-b border-border px-4 py-3">
							<p className="truncate pr-3 text-[12px] font-medium text-foreground">
								Share this file · {roomName}
							</p>
							<div className="flex items-center gap-2">
								<button
									type="button"
									onClick={copyLink}
									className="inline-flex items-center gap-1 rounded-[0.45rem] px-2.5 py-1 text-[11px] text-primary transition hover:bg-primary/10"
								>
									{copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
									{copied ? 'Copied' : 'Copy link'}
								</button>
								<button
									type="button"
									className="rounded-[0.45rem] p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
									onClick={() => setIsOpen(false)}
								>
									<X className="h-4 w-4" />
								</button>
							</div>
						</div>
						<div className="border-b border-border px-4 py-3">
							<div className="flex items-center gap-2">
								<input
									type="text"
									placeholder="Add comma separated emails to invite"
									value={email}
									onChange={e => setEmail(e.target.value)}
									className="figma-control w-full text-[12px]"
								/>
								<button
									type="button"
									onClick={inviteUser}
									className="inline-flex h-8 items-center gap-1 rounded-[0.45rem] bg-primary px-3 text-[11px] font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
									disabled={!email.trim()}
								>
									<Send className="h-3.5 w-3.5" />
									Send
								</button>
							</div>
							{error && <p className="mt-2 text-[11px] text-destructive">{error}</p>}
						</div>
						<div className="max-h-[340px] overflow-y-auto px-4 py-3">
							<p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
								Who has access
							</p>
							<ul className="mt-2 space-y-1.5">
								{roomVisibility === RoomVisibility.PUBLIC && (
									<li className="flex items-center justify-between rounded-[0.45rem] px-2.5 py-2 hover:bg-muted/60">
										<div className="flex items-center gap-2">
											<div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground">
												<Link2 className="h-3.5 w-3.5" />
											</div>
											<p className="text-[12px] text-foreground">Anyone with link</p>
										</div>
										<p className="text-[11px] text-muted-foreground">can view</p>
									</li>
								)}
								<li className="flex items-center justify-between rounded-[0.45rem] px-2.5 py-2 hover:bg-muted/60">
									<div className="flex items-center gap-2">
										<UserAvatar name={owner.email ?? owner.name ?? 'Owner'} className="h-7 w-7" />
										<p className="text-[12px] text-foreground">{owner.email ?? owner.name}</p>
									</div>
									<p className="text-[11px] font-medium text-foreground">owner</p>
								</li>
								{othersWithAccessToRoom.map(user => (
									<li
										className="flex items-center justify-between rounded-[0.45rem] px-2.5 py-2 hover:bg-muted/60"
										key={user.id}
									>
										<div className="flex items-center space-x-3">
											<UserAvatar name={user.email ?? 'Anonymous'} className="h-7 w-7" />
											<span className="text-[12px] text-foreground">{user.email}</span>
										</div>
										<div className="flex items-center space-x-2">
											<span className="text-[11px] text-muted-foreground">can edit</span>
											<button
												type="button"
												onClick={() => deleteRoomInvite(roomId, user.email)}
												className="rounded-[0.35rem] p-1 text-muted-foreground transition hover:bg-muted hover:text-destructive"
												aria-label={`Remove ${user.email} access`}
											>
												<X className="h-3.5 w-3.5" />
											</button>
										</div>
									</li>
								))}
								{othersWithAccessToRoom.length === 0 && roomVisibility !== RoomVisibility.PUBLIC && (
									<li className="rounded-[0.45rem] border border-dashed border-border px-2.5 py-3 text-[11px] text-muted-foreground">
										No collaborators yet.
									</li>
								)}
							</ul>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ShareMenu;
