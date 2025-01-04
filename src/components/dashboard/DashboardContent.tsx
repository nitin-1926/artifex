import UserMenu from '~/components/dashboard/UserMenu';
import { auth } from '~/server/auth';
import { db } from '~/server/db';

export async function DashboardContent() {
	const session = await auth();

	const user = await db.user.findUniqueOrThrow({
		where: {
			id: session?.user.id,
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

	return (
		<div className="flex h-screen w-full">
			<div className="flex h-screen min-w-[264px] flex-col border-r border-gray-200 bg-white p-2">
				<UserMenu email={user.email} />
			</div>
		</div>
	);
}
