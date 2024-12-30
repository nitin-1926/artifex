import { CiPen } from 'react-icons/ci';
import IconButton from './IconButton';

const PencilButton = ({ isActive, onClick }: { isActive: boolean; onClick: () => void }) => {
	return (
		<IconButton isActive={isActive} onClick={onClick}>
			<CiPen className="h-5 w-5" />
		</IconButton>
	);
};

export default PencilButton;
