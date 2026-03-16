import { AiOutlineZoomOut } from 'react-icons/ai';
import IconButton from './IconButton';

const ZoomOutButton = ({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) => {
	return (
		<IconButton onClick={onClick} disabled={disabled} label="Zoom out">
			<AiOutlineZoomOut size={16} />
		</IconButton>
	);
};

export default ZoomOutButton;
