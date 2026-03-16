import { GrRedo } from 'react-icons/gr';
import IconButton from './IconButton';

const RedoButton = ({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) => {
	return (
		<IconButton onClick={onClick} disabled={disabled} label="Redo">
			<GrRedo size={15} />
		</IconButton>
	);
};

export default RedoButton;
