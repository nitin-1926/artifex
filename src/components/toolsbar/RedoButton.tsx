import { GrRedo } from 'react-icons/gr';
import IconButton from './IconButton';

const RedoButton = ({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) => {
	return (
		<IconButton onClick={onClick} disabled={disabled}>
			<GrRedo size={22} color="#888" />
		</IconButton>
	);
};

export default RedoButton;
