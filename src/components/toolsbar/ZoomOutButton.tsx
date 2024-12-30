import { AiOutlineZoomOut } from 'react-icons/ai';
import IconButton from './IconButton';

const ZoomOutButton = ({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) => {
	return (
		<IconButton onClick={onClick} disabled={disabled}>
			<AiOutlineZoomOut size={22} color="#888" />
		</IconButton>
	);
};

export default ZoomOutButton;
