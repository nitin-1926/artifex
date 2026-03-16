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
			className={`flex min-h-[30px] min-w-[30px] items-center justify-center rounded-[0.45rem] border px-1.5 py-1.5 text-[#b4b4b6] transition duration-150 hover:enabled:border-[#4a4a4c] hover:enabled:bg-[#343436] hover:enabled:text-[#f5f5f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5d8dff]/45 active:enabled:scale-[0.98] disabled:cursor-not-allowed ${isActive ? 'border-[#4f8cff] bg-[#2f4773] text-[#d6e5ff]' : 'border-[#424245] bg-[#2a2a2b]'} ${disabled ? 'opacity-45' : ''}`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

export default IconButton;
