const IconButton = ({
	onClick,
	children,
	isActive,
	disabled,
}: {
	onClick: () => void;
	children: React.ReactNode;
	isActive?: boolean;
	disabled?: boolean;
}) => {
	return (
		<button
			className={`flex items-center justify-center min-h-[28px] min-w-[28px] rounded-md text-gray-500 hover:enabled:text-gray-700 focus:enabled:text-gray-700 active:enabled:text-gray-900 disabled:cursor-not-allowed p-2 ${isActive ? 'bg-gray-100 text-blue-600 hover:enabled:text-blue-600 focus:enabled:text-blue-600 active:enabled:text-blue-600' : ''} ${disabled ? 'opacity-50' : ''}`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

export default IconButton;
