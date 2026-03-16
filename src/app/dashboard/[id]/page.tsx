import { redirect } from 'next/navigation';
import { RoomVisibility } from '@prisma/client';
import Canvas from '~/components/canvas/Canvas';
import Room from '~/components/liveblocks/Room';
import { auth } from '~/server/auth';
import { db } from '~/server/db';

type Props = Promise<{
	id: string;
}>;

const DashboardIdPage = async ({ params }: { params: Props }) => {
	const { id } = await params;
	const session = await auth();

	if (!session?.user.id) {
		return redirect('/dashboard');
	}

	const room = await db.room.findUniqueOrThrow({
		where: {
			id,
		},
		select: {
			title: true,
			description: true,
			visibility: true,
			archivedAt: true,
			ownerId: true,
			owner: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			roomInvites: {
				select: {
					user: true,
				},
			},
		},
	});

	if (!room) {
		return redirect('/404');
	}

	const invitedUserIds = room.roomInvites.map(invite => invite.user.id);
	const canViewPublic = room.visibility === RoomVisibility.PUBLIC;
	if (!canViewPublic && !invitedUserIds.includes(session.user.id ?? '') && session?.user.id !== room.ownerId) {
		return redirect('/404');
	}
	if (room.archivedAt && room.ownerId !== session.user.id) {
		return redirect('/dashboard');
	}

	const canManageRoom = room.ownerId === session.user.id;

	return (
		<Room roomId={`room:${id}`}>
			<Canvas
				roomName={room.title}
				roomId={id}
				othersWithAccess={room.roomInvites.map(invite => invite.user)}
				roomOwner={room.owner}
				roomVisibility={room.visibility}
				canManageRoom={canManageRoom}
			/>
		</Room>
	);
};

export default DashboardIdPage;
