'use server';

import { redirect } from 'next/navigation';
import { auth } from '~/server/auth';
import { db } from '~/server/db';

export const createRoom = async () => {
	const session = await auth();

	if (!session?.user.id) throw new Error('No user id found.');

	const room = await db.room.create({
		data: {
			owner: {
				connect: {
					id: session.user.id,
				},
			},
		},
		select: {
			id: true,
		},
	});

	redirect('/dashboard/' + room.id);
};
