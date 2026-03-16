import { type User } from '@prisma/client';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { deleteRoomInvite, shareRoom } from '~/app/actions/rooms';
import UserAvatar from './UserAvatar';

const ShareMenu = ({ roomId, othersWithAccessToRoom }: { roomId: string; othersWithAccessToRoom: User[] }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [email, setEmail] = useState('');
	const [error, setError] = useState<string | undefined>(undefined);

	const inviteUser = async () => {
		const error = await shareRoom(roomId, email);
		setError(error);
	};

	return (
		<div>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="rounded-[0.45rem] border border-[#4a4a4c] bg-[#2d2d2f] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-[#d4d4d8] transition hover:border-[#5d8dff] hover:text-[#d6e5ff]"
			>
				Share
			</button>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/18 p-4 backdrop-blur-sm">
					<div className="flex w-full max-w-lg flex-col rounded-[0.65rem] border border-[#3f3f42] bg-[#252527] shadow-[0_24px_60px_-36px_rgba(0,0,0,0.72)]">
						<div className="flex items-center justify-between px-5 py-4">
							<div>
								<p className="text-[10px] font-medium uppercase tracking-[0.11em] text-[#9a9a9d]">
									Collaboration
								</p>
								<h2 className="mt-1.5 text-[18px] text-[#f4f4f5]">Share this room</h2>
							</div>
							<button
								type="button"
								className="rounded-[0.45rem] border border-[#4a4a4c] p-2 text-[#9a9a9d] transition hover:border-[#5d8dff] hover:text-[#d6e5ff]"
								onClick={() => setIsOpen(false)}
							>
								<X className="h-4 w-4" />
							</button>
						</div>
						<div className="border-b border-[#3b3b3e]" />
						<div className="space-y-4 p-5">
							<div className="flex items-center gap-2">
								<input
									type="text"
									placeholder="Invite others by email"
									value={email}
									onChange={e => setEmail(e.target.value)}
									className="figma-control h-9 w-full rounded-[0.45rem] text-[12px] placeholder:text-[#8a8a8e]"
								/>
								<button
									type="button"
									onClick={inviteUser}
									className="inline-flex h-9 items-center gap-2 rounded-[0.45rem] bg-[#3869c8] px-3 text-[11px] font-medium text-white transition hover:bg-[#4978d2]"
								>
									<Plus className="h-3.5 w-3.5" />
									Invite
								</button>
							</div>
							{error && <p className="text-sm text-destructive">{error}</p>}
							<p className="text-[10px] font-medium uppercase tracking-[0.11em] text-[#9a9a9d]">
								Who has access
							</p>
							<ul className="space-y-2">
								{othersWithAccessToRoom.map((user, index) => (
									<li
										className="flex items-center justify-between rounded-[0.5rem] border border-[#3b3b3e] bg-[#2c2c2e] px-3 py-2.5"
										key={index}
									>
										<div className="flex items-center space-x-3">
											<UserAvatar name={user.email ?? 'Anonymous'} className="h-9 w-9" />
											<span className="text-[12px] text-[#f4f4f5]">{user.email}</span>
										</div>
										<div className="flex items-center space-x-2">
											<span className="text-[10px] uppercase tracking-[0.1em] text-[#9a9a9d]">
												Full access
											</span>
											<X
												onClick={() => deleteRoomInvite(roomId, user.email)}
												className="h-4 w-4 cursor-pointer text-muted-foreground transition hover:text-destructive"
											/>
										</div>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ShareMenu;
