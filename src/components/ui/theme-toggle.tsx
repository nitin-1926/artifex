'use client';

import { motion } from 'framer-motion';
import { Moon, SunMedium } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '~/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div
				aria-hidden="true"
				className={cn('h-8 w-8 rounded-[0.55rem] border border-border/80 bg-card/85 backdrop-blur', className)}
			/>
		);
	}

	const isDark = resolvedTheme === 'dark';

	return (
		<button
			type="button"
			aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			className={cn(
				'relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-[0.55rem] border border-border/85 bg-card/90 text-foreground shadow-[0_8px_20px_-18px_rgba(15,23,42,0.8)] transition duration-200 hover:border-primary/45 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
				className,
			)}
		>
			<motion.span
				initial={false}
				animate={{ scale: isDark ? 0.85 : 1, opacity: isDark ? 0 : 1, rotate: isDark ? -35 : 0 }}
				transition={{ duration: 0.22, ease: 'easeOut' }}
				className="absolute"
			>
				<SunMedium className="h-3.5 w-3.5" />
			</motion.span>
			<motion.span
				initial={false}
				animate={{ scale: isDark ? 1 : 0.8, opacity: isDark ? 1 : 0, rotate: isDark ? 0 : 35 }}
				transition={{ duration: 0.22, ease: 'easeOut' }}
				className="absolute"
			>
				<Moon className="h-3.5 w-3.5" />
			</motion.span>
		</button>
	);
}
