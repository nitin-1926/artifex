import { AiOutlineZoomIn } from 'react-icons/ai';
import IconButton from './IconButton';

const ZoomInButton = ({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) => {
	return (
		<IconButton onClick={onClick} disabled={disabled}>
			<AiOutlineZoomIn size={24} color="#888" />
		</IconButton>
	);
};

export default ZoomInButton;
