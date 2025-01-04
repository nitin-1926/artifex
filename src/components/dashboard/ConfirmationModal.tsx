const ConfirmationModal = ({
	isOpen,
	onClose,
	onConfirm,
	message,
}: {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	message: string;
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 p-2">
			<div className="w-full max-w-md rounded-md bg-white p-6 shadow-xl">
				<h2 className="text-xs font-semibold text-gray-900">Confirm</h2>
				<p className="mt-2 text-xs text-gray-900">{message}</p>
				<div className="mt-4 flex justify-center space-x-4 text-sm">
					<button
						className="rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-700 hover:bg-gray-50"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						className="rounded-md bg-[#121212] px-2 py-1 text-white hover:bg-[#3b3b3]"
						onClick={onConfirm}
					>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationModal;
