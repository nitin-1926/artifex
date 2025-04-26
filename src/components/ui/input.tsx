'use client';
import * as React from 'react';
import { cn } from '~/lib/utils';
import { useMotionTemplate, useMotionValue, motion } from 'framer-motion';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	className?: string;
	type?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
	const radius = 130;
	const [visible, setVisible] = React.useState(false);

	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
		const { left, top } = currentTarget.getBoundingClientRect();

		mouseX.set(clientX - left);
		mouseY.set(clientY - top);
	}
	return (
		<motion.div
			style={{
				background: useMotionTemplate`
					radial-gradient(
						${visible ? radius + 'px' : '0px'} circle at ${mouseX}px ${mouseY}px,
						hsl(var(--primary) / 0.38),
						transparent 80%
    				)
    `,
			}}
			onMouseMove={handleMouseMove}
			onMouseEnter={() => setVisible(true)}
			onMouseLeave={() => setVisible(false)}
			className="group/input rounded-[1.15rem] p-[1px] transition duration-300"
		>
			<input
				type={type}
				className={cn(
					`flex h-12 w-full rounded-[calc(var(--radius)-0.15rem)] border border-border/70 bg-background/80 px-4 py-3 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 group-hover/input:border-primary/35 group-hover/input:shadow-none dark:bg-white/[0.03]
        `,
					className,
				)}
				ref={ref}
				{...props}
			/>
		</motion.div>
	);
});
Input.displayName = 'Input';

export { Input };
