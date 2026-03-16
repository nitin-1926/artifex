const IconButton = ({
	onClick,
	children,
	isActive,
	disabled,
	label,
}: {
	onClick: () => void;
	children: React.ReactNode;
	isActive?: boolean;
	disabled?: boolean;
	label: string;
}) => {
	return (
		<button
			type="button"
			aria-label={label}
			title={label}
			className={`flex min-h-[30px] min-w-[30px] items-center justify-center rounded-[0.45rem] border px-1.5 py-1.5 text-muted-foreground transition duration-150 hover:enabled:border-border hover:enabled:bg-muted hover:enabled:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 active:enabled:scale-[0.98] disabled:cursor-not-allowed ${
				isActive ? 'border-primary/55 bg-primary/15 text-primary' : 'border-border bg-card'
			} ${disabled ? 'opacity-45' : ''}`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

export default IconButton;
