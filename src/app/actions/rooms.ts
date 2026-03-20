'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { RoomVisibility } from '@prisma/client';
import { auth } from '~/server/auth';
import { db } from '~/server/db';

const getAuthenticatedUserId = async () => {
	const session = await auth();
	if (!session?.user.id) {
		throw new Error('No user id found.');
	}

	return session.user.id;
};

const ensureRoomOwner = async (roomId: string, userId: string) => {
	await db.room.findUniqueOrThrow({
		where: {
			id: roomId,
			ownerId: userId,
		},
		select: { id: true },
	});
};

export const createRoom = async () => {
	const userId = await getAuthenticatedUserId();

	const room = await db.room.create({
		data: {
			owner: {
				connect: {
					id: userId,
				},
			},
		},
		select: {
			id: true,
		},
	});

	redirect('/dashboard/' + room.id);
};

const revalidateRoomViews = (roomId?: string) => {
	revalidatePath('/dashboard');
	revalidatePath('/dashboard/archived');
	revalidatePath('/dashboard/community');
	if (roomId) {
		revalidatePath('/dashboard/' + roomId);
	}
};

export const archiveRoom = async (id: string) => {
	const userId = await getAuthenticatedUserId();
	await ensureRoomOwner(id, userId);

	await db.room.update({
		where: { id },
		data: { archivedAt: new Date() },
	});

	revalidateRoomViews(id);
};

export const unarchiveRoom = async (id: string) => {
	const userId = await getAuthenticatedUserId();
	await ensureRoomOwner(id, userId);

	await db.room.update({
		where: { id },
		data: { archivedAt: null },
	});

	revalidateRoomViews(id);
};

export const deleteRoomPermanently = async (id: string) => {
	const userId = await getAuthenticatedUserId();
	await ensureRoomOwner(id, userId);

	await db.roomInvite.deleteMany({
		where: { roomId: id },
	});

	await db.room.delete({
		where: { id },
	});

	revalidateRoomViews();
};

// Backward-compatible alias. "Delete" from active view is now soft delete (archive).
export const deleteRoom = async (id: string) => {
	await archiveRoom(id);
};

export const updateRoomTitle = async (id: string, title: string) => {
	const userId = await getAuthenticatedUserId();
	await ensureRoomOwner(id, userId);

	await db.room.update({
		where: { id },
		data: {
			title: title.trim() || 'Untitled',
		},
	});

	revalidateRoomViews(id);
};

export const updateRoomDescription = async (id: string, description: string) => {
	const userId = await getAuthenticatedUserId();
	await ensureRoomOwner(id, userId);

	await db.room.update({
		where: { id },
		data: {
			description: description.trim() || 'Add a short description',
		},
	});

	revalidateRoomViews(id);
};

export const updateRoomVisibility = async (id: string, visibility: RoomVisibility) => {
	const userId = await getAuthenticatedUserId();
	await ensureRoomOwner(id, userId);

	await db.room.update({
		where: { id },
		data: { visibility },
	});

	revalidateRoomViews(id);
};

export const shareRoom = async (id: string, inviteEmail: string) => {
	const userId = await getAuthenticatedUserId();
	await ensureRoomOwner(id, userId);

	const invitedUser = await db.user.findUnique({
		where: { email: inviteEmail.trim().toLowerCase() },
		select: { id: true },
	});

	if (!invitedUser) return 'User not found.';
	if (invitedUser.id === userId) return 'You already own this room.';

	await db.roomInvite.upsert({
		where: {
			roomId_userId: {
				roomId: id,
				userId: invitedUser.id,
			},
		},
		update: {},
		create: {
			roomId: id,
			userId: invitedUser.id,
		},
	});

	revalidateRoomViews(id);
};

export const deleteRoomInvite = async (id: string, inviteEmail: string) => {
	const userId = await getAuthenticatedUserId();
	await ensureRoomOwner(id, userId);

	await db.roomInvite.deleteMany({
		where: {
			roomId: id,
			user: {
				email: inviteEmail,
			},
		},
	});

	revalidateRoomViews(id);
};
