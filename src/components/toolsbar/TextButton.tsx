import { AiOutlineFontSize } from 'react-icons/ai';
import IconButton from './IconButton';

const TextButton = ({ isActive, onClick }: { isActive: boolean; onClick: () => void }) => {
	return (
		<IconButton onClick={onClick} isActive={isActive} label="Text tool">
			<AiOutlineFontSize className="h-4 w-4" />
		</IconButton>
	);
};

export default TextButton;
