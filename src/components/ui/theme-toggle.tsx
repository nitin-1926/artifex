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
				className={cn(
					'h-10 w-10 rounded-full border border-border/60 bg-background/60 backdrop-blur-xl',
					className,
				)}
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
				'relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-background/70 text-foreground shadow-[0_10px_30px_-18px_rgba(15,23,42,0.65)] backdrop-blur-xl transition duration-300 hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
				className,
			)}
		>
			<motion.span
				initial={false}
				animate={{ scale: isDark ? 0.85 : 1, opacity: isDark ? 0 : 1, rotate: isDark ? -35 : 0 }}
				transition={{ duration: 0.22, ease: 'easeOut' }}
				className="absolute"
			>
				<SunMedium className="h-4 w-4" />
			</motion.span>
			<motion.span
				initial={false}
				animate={{ scale: isDark ? 1 : 0.8, opacity: isDark ? 1 : 0, rotate: isDark ? 0 : 35 }}
				transition={{ duration: 0.22, ease: 'easeOut' }}
				className="absolute"
			>
				<Moon className="h-4 w-4" />
			</motion.span>
		</button>
	);
}
