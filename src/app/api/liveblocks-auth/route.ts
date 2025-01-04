import { Liveblocks } from '@liveblocks/node';
import { env } from '~/env';
import { auth } from '~/server/auth';
import { db } from '~/server/db';

const liveblocks = new Liveblocks({
	secret: env.LIVEBLOCKS_SECRET_KEY,
});

export async function POST(request: Request) {
	const userSession = await auth();

	// Get the user's room and invitations to rooms
	const user = await db.user.findUniqueOrThrow({
		where: {
			id: userSession?.user.id,
		},
		include: {
			ownedRooms: true,
			roomInvites: {
				include: {
					room: true,
				},
			},
		},
	});

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

	const { status, body } = await session.authorize();

	return new Response(body, { status });
}
