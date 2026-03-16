import { Liveblocks } from '@liveblocks/node';
import { RoomVisibility } from '@prisma/client';
import { env } from '~/env';
import { auth } from '~/server/auth';
import { db } from '~/server/db';

const liveblocks = new Liveblocks({
	secret: env.LIVEBLOCKS_SECRET_KEY,
});

export async function POST(request: Request) {
	const userSession = await auth();
	if (!userSession?.user.id) {
		return new Response('Unauthorized', { status: 401 });
	}
	const requestBody = (await request.json().catch(() => ({}))) as { room?: string };
	const requestedRoomId =
		typeof requestBody.room === 'string' && requestBody.room.startsWith('room:')
			? requestBody.room.replace('room:', '')
			: null;

	// Get the user's room and invitations to rooms
	const user = await db.user.findUnique({
		where: {
			id: userSession.user.id,
		},
		include: {
			ownedRooms: {
				where: {
					archivedAt: null,
				},
			},
			roomInvites: {
				include: {
					room: true,
				},
			},
		},
	});
	if (!user) {
		return new Response('Unauthorized', { status: 401 });
	}

	const session = liveblocks.prepareSession(user.id, {
		userInfo: {
			name: user.email ?? 'Anonymous',
		},
	});

	user.ownedRooms.forEach(room => {
		session.allow(`room:${room.id}`, session.FULL_ACCESS);
	});

	user.roomInvites.forEach(invite => {
		session.allow(`room:${invite.room.id}`, session.FULL_ACCESS);
	});

	if (requestedRoomId) {
		const publicRoom = await db.room.findUnique({
			where: { id: requestedRoomId },
			select: {
				id: true,
				visibility: true,
				archivedAt: true,
			},
		});
		if (
			publicRoom &&
			publicRoom.visibility === RoomVisibility.PUBLIC &&
			publicRoom.archivedAt === null
		) {
			session.allow(`room:${publicRoom.id}`, session.FULL_ACCESS);
		}
	}

	const { status, body } = await session.authorize();

	return new Response(body, { status });
}
