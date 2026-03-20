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
				className="flex w-full items-center gap-2 rounded-[0.5rem] border border-border bg-card px-2.5 py-2 text-left transition duration-200 hover:border-primary/30"
			>
				<UserAvatar name={email ?? 'Anonymous'} />
				<div className="min-w-0 flex-1">
					<p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground">Account</p>
					<h2 className="truncate text-[11px] font-medium text-foreground">{email}</h2>
				</div>
				<ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition ${isOpen ? 'rotate-180' : ''}`} />
			</button>
			<div
				className={`${isOpen ? '' : 'hidden'} absolute left-0 top-[calc(100%+0.35rem)] z-20 flex min-w-full flex-col rounded-[0.5rem] border border-border bg-card p-1`}
				ref={menuRef}
			>
				<button
					type="button"
					onClick={() => logout()}
					className="flex w-full items-center justify-between rounded-[0.45rem] px-2.5 py-1.5 text-[11px] text-foreground transition hover:bg-muted"
				>
					<span>Sign out</span>
					<LogOut className="h-3.5 w-3.5" />
				</button>
			</div>
		</div>
	);
}
