'use client';

import { ArrowRight, Plus } from 'lucide-react';
import { createRoom } from '~/app/actions/rooms';

const CreateRoom = () => {
	return (
		<button
			type="button"
			onClick={() => createRoom()}
			className="group flex w-full max-w-sm items-center justify-between rounded-[0.8rem] border border-border/80 bg-card px-4 py-3 text-left transition duration-200 hover:border-primary/30 hover:bg-primary/[0.03]"
		>
			<div className="flex items-center gap-3">
				<div className="flex h-9 w-9 items-center justify-center rounded-[0.7rem] bg-primary/10 text-primary">
					<Plus className="h-3.5 w-3.5" />
				</div>
				<div className="space-y-0.5">
					<p className="text-[13px] font-semibold text-foreground">New room</p>
					<p className="text-[13px] text-muted-foreground">Create a blank collaborative design file.</p>
				</div>
			</div>
			<div className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition duration-200 group-hover:text-primary">
				<ArrowRight className="h-3.5 w-3.5" />
			</div>
		</button>
	);
};

export default CreateRoom;
