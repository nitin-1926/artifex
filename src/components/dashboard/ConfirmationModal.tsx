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
			<div className="glass-panel w-full max-w-md rounded-[1.75rem] p-6">
				<p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-destructive/90">
					Confirm action
				</p>
				<h2 className="mt-3 text-2xl text-foreground">Delete room?</h2>
				<p className="mt-2 text-sm leading-7 text-muted-foreground">{message}</p>
				<div className="mt-6 flex justify-end gap-3 text-sm">
					<button
						className="rounded-full border border-border/70 bg-background/80 px-4 py-2 text-foreground transition hover:border-primary/35 hover:bg-primary/5"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						className="rounded-full bg-destructive px-4 py-2 font-medium text-destructive-foreground transition hover:opacity-90"
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
