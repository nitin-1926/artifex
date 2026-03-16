import { AiOutlineZoomIn } from 'react-icons/ai';
import IconButton from './IconButton';

const ZoomInButton = ({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) => {
	return (
		<IconButton onClick={onClick} disabled={disabled} label="Zoom in">
			<AiOutlineZoomIn size={20} />
		</IconButton>
	);
};

export default ZoomInButton;
