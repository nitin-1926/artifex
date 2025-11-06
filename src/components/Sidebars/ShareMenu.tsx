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
				className="rounded-[0.6rem] border border-[#d7d8dc] bg-[#ffffff] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#4b5563] transition hover:border-[#bfd3ff] hover:text-[#2563eb]"
			>
				Share
			</button>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/18 p-4 backdrop-blur-sm">
					<div className="flex w-full max-w-lg flex-col rounded-[0.9rem] border border-[#d7d8dc] bg-[#fbfbfc] shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
						<div className="flex items-center justify-between px-5 py-4">
							<div>
								<p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
									Collaboration
								</p>
								<h2 className="mt-1.5 text-xl text-foreground">Share this room</h2>
							</div>
							<button
								type="button"
								className="rounded-[0.6rem] border border-[#d7d8dc] p-2 text-[#6b7280] transition hover:border-[#bfd3ff] hover:text-[#2563eb]"
								onClick={() => setIsOpen(false)}
							>
								<X className="h-4 w-4" />
							</button>
						</div>
						<div className="border-b border-[#e4e4e7]" />
						<div className="space-y-4 p-5">
							<div className="flex items-center gap-2">
								<input
									type="text"
									placeholder="Invite others by email"
									value={email}
									onChange={e => setEmail(e.target.value)}
									className="h-10 w-full rounded-[0.65rem] border border-[#d7d8dc] bg-[#ffffff] px-3 text-[13px] placeholder:text-[#9ca3af] focus:border-[#93c5fd] focus:outline-none"
								/>
								<button
									type="button"
									onClick={inviteUser}
									className="inline-flex h-10 items-center gap-2 rounded-[0.65rem] bg-[#2563eb] px-4 text-[13px] font-semibold text-white transition hover:bg-[#1d4ed8]"
								>
									<Plus className="h-4 w-4" />
									Invite
								</button>
							</div>
							{error && <p className="text-sm text-destructive">{error}</p>}
							<p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
								Who has access
							</p>
							<ul className="space-y-2">
								{othersWithAccessToRoom.map((user, index) => (
									<li
										className="flex items-center justify-between rounded-[0.7rem] border border-[#e4e4e7] bg-[#ffffff] px-3 py-2.5"
										key={index}
									>
										<div className="flex items-center space-x-3">
											<UserAvatar name={user.email ?? 'Anonymous'} className="h-9 w-9" />
											<span className="text-[13px] text-foreground">{user.email}</span>
										</div>
										<div className="flex items-center space-x-2">
											<span className="text-[10px] uppercase tracking-[0.12em] text-[#6b7280]">
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
