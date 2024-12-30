import { AiOutlineFontSize } from 'react-icons/ai';
import IconButton from './IconButton';

const TextButton = ({ isActive, onClick }: { isActive: boolean; onClick: () => void }) => {
	return (
		<IconButton onClick={onClick} isActive={isActive}>
			<AiOutlineFontSize className="h-5 w-5" />
		</IconButton>
	);
};

export default TextButton;
