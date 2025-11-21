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
			className={`flex items-center gap-2 rounded-[0.65rem] px-2.5 py-2 text-left text-[12px] transition hover:bg-[#f3f4f6] ${isSelected ? 'bg-[#eaf2ff] text-[#2563eb]' : 'text-[#374151]'}`}
			onClick={() => updateSelection(layerId)}
		>
			{icon}
			<span>{text}</span>
		</button>
	);
};

export default LayerButton;
