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
			className={`flex items-center gap-2 rounded px-1.5 py-1 text-left text-[11px] hover:bg-gray-100 ${isSelected ? 'bg-[#bce3ff]' : ''}`}
			onClick={() => updateSelection(layerId)}
		>
			{icon}
			<span>{text}</span>
		</button>
	);
};

export default LayerButton;
