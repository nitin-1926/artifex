'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { logout } from '~/app/actions/auth';
import UserAvatar from '../Sidebars/UserAvatar';

export default function UserMenu({ email }: { email: string | null }) {
	const menuRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className="relative">
			<button
				type="button"
				onClick={() => setIsOpen(prev => !prev)}
				className="glass-panel flex w-full items-center gap-2.5 rounded-[0.8rem] px-3 py-2.5 text-left transition duration-200 hover:border-primary/30"
			>
				<UserAvatar name={email ?? 'Anonymous'} />
				<div className="min-w-0 flex-1">
					<p className="text-[0.62rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
						Account
					</p>
					<h2 className="truncate text-[13px] font-semibold text-foreground">{email}</h2>
				</div>
				<ChevronDown className={`h-4 w-4 text-muted-foreground transition ${isOpen ? 'rotate-180' : ''}`} />
			</button>
			<div
				className={`${isOpen ? '' : 'hidden'} glass-panel absolute left-0 top-[calc(100%+0.4rem)] z-20 flex min-w-full flex-col rounded-[0.8rem] p-1.5`}
				ref={menuRef}
			>
				<button
					type="button"
					onClick={() => logout()}
					className="flex w-full items-center justify-between rounded-[0.7rem] px-3 py-2 text-[13px] text-foreground transition hover:bg-primary/10 hover:text-primary"
				>
					<span>Sign out</span>
					<LogOut className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
}
