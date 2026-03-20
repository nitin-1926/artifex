'use client';

import { ArrowRight, Plus } from 'lucide-react';
import { createRoom } from '~/app/actions/rooms';

const CreateRoom = () => {
	return (
		<button
			type="button"
			onClick={() => createRoom()}
			className="group flex h-9 items-center justify-between gap-3 rounded-[0.5rem] border border-border bg-card px-3 text-left transition duration-200 hover:border-primary/45"
		>
			<div className="flex items-center gap-2.5">
				<div className="flex h-6 w-6 items-center justify-center rounded-[0.45rem] bg-primary/15 text-primary">
					<Plus className="h-3 w-3" />
				</div>
				<p className="text-[11px] font-medium text-foreground">New file</p>
			</div>
			<div className="flex h-6 w-6 items-center justify-center rounded-[0.45rem] text-muted-foreground transition duration-200 group-hover:text-primary">
				<ArrowRight className="h-3 w-3" />
			</div>
		</button>
	);
};

export default CreateRoom;
