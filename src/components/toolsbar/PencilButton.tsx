import { CiPen } from 'react-icons/ci';
import IconButton from './IconButton';

const PencilButton = ({ isActive, onClick }: { isActive: boolean; onClick: () => void }) => {
	return (
		<IconButton isActive={isActive} onClick={onClick} label="Pencil tool">
			<CiPen className="h-4 w-4" />
		</IconButton>
	);
};

export default PencilButton;
