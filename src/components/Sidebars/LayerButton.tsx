'use client';

import { useMutation } from '@liveblocks/react';
import { type ReactNode } from 'react';

const LayerButton = ({
	layerId,
	text,
	icon,
	isSelected,
}: {
	layerId: string;
	text: string;
	icon: ReactNode;
	isSelected: boolean;
}) => {
	const updateSelection = useMutation(({ setMyPresence }, layerId: string) => {
		setMyPresence({ selection: [layerId] }, { addToHistory: true });
	}, []);

	return (
		<button
			type="button"
			className={`flex items-center gap-2 rounded-[0.45rem] px-2 py-1.5 text-left text-[11px] transition hover:bg-muted ${
				isSelected ? 'bg-primary/20 text-primary' : 'text-foreground'
			}`}
			onClick={() => updateSelection(layerId)}
		>
			{icon}
			<span>{text}</span>
		</button>
	);
};

export default LayerButton;
