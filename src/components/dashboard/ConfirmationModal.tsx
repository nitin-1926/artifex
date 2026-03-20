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
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-md">
			<div className="w-full max-w-md rounded-[0.65rem] border border-white/10 bg-[#252527] p-5 text-[#f4f4f5]">
				<p className="text-[10px] font-medium uppercase tracking-[0.1em] text-destructive/90">Confirm action</p>
				<h2 className="mt-3 text-[22px]">Delete room?</h2>
				<p className="mt-2 text-[12px] leading-6 text-[#9a9a9d]">{message}</p>
				<div className="mt-6 flex justify-end gap-2 text-sm">
					<button
						className="rounded-[0.45rem] border border-white/15 bg-[#2d2d2f] px-3 py-1.5 text-[12px] text-[#f4f4f5] transition hover:border-white/25"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						className="rounded-[0.45rem] bg-destructive px-3 py-1.5 text-[12px] font-medium text-destructive-foreground transition hover:opacity-90"
						onClick={onConfirm}
					>
						Delete room
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationModal;
