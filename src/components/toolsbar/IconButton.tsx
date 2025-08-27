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
			className={`flex min-h-[34px] min-w-[34px] items-center justify-center rounded-[0.55rem] border px-2 py-2 text-[#6b7280] transition duration-150 hover:enabled:border-[#cfd6e4] hover:enabled:bg-[#f3f4f6] hover:enabled:text-[#111827] focus:enabled:border-[#cfd6e4] focus:enabled:bg-[#f3f4f6] focus:enabled:text-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:enabled:scale-[0.98] disabled:cursor-not-allowed ${isActive ? 'border-[#bfd3ff] bg-[#eaf2ff] text-[#2563eb]' : 'border-[#d7d8dc] bg-[#ffffff]'} ${disabled ? 'opacity-45' : ''}`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

export default IconButton;
