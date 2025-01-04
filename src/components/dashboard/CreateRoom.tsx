'use client';

import { useState } from 'react';
import { SlPencil } from 'react-icons/sl';
import { createRoom } from '~/app/actions/rooms';

const CreateRoom = () => {
	const [hover, setHover] = useState(false);

	return (
		<div
			onMouseOver={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			onClick={() => createRoom()}
			className="flex h-fit w-fit cursor-pointer select-none items-center gap-3 rounded-xl bg-gray-100 px-6 py-5 transition-all hover:bg-blue-500"
		>
			<div className="flex h-fit w-fit items-center justify-center rounded-full bg-blue-600 p-2">
				<SlPencil className="h-4 w-4 text-white" />
			</div>
			<div className="flex flex-col gap-0.5 text-[11px]">
				<p className={`font-semibold ${hover ? 'text-white' : 'text-black'}`}>New design file</p>
				<p className={`${hover ? 'text-white' : 'text-black'}`}>Create a new design</p>
			</div>
		</div>
	);
};

export default CreateRoom;
