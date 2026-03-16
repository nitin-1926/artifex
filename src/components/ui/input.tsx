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
						hsl(var(--primary) / 0.24),
						transparent 80%
    				)
    `,
			}}
			onMouseMove={handleMouseMove}
			onMouseEnter={() => setVisible(true)}
			onMouseLeave={() => setVisible(false)}
			className="group/input rounded-[0.5rem] p-[1px] transition duration-300"
		>
			<input
				type={type}
				className={cn(
					`flex h-9 w-full rounded-[calc(var(--radius)-0.12rem)] border border-[#4a4a4c] bg-[#2d2d2f] px-3 py-2 text-[12px] text-[#f4f4f5] transition duration-300 file:border-0 file:bg-transparent file:text-[12px] file:font-medium placeholder:text-[#8a8a8e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5d8dff]/40 disabled:cursor-not-allowed disabled:opacity-50 group-hover/input:border-[#5d8dff]/45 group-hover/input:shadow-none
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
