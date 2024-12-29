import Canvas from '~/components/canvas/Canvas';
import Room from '~/components/liveblocks/Room';
import { auth } from '~/server/auth';

type Props = Promise<{
	id: string;
}>;

const DashboardIdPage = async ({ params }: { params: Props }) => {
	const { id } = await params;
	const session = await auth();

	return (
		<Room roomId={`room:${id}`}>
			<Canvas />
		</Room>
	);
};

export default DashboardIdPage;
