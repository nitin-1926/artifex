import { GrUndo } from 'react-icons/gr';
import IconButton from './IconButton';

const UndoButton = ({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) => {
	return (
		<IconButton onClick={onClick} disabled={disabled}>
			<GrUndo size={22} color="#888" />
		</IconButton>
	);
};

export default UndoButton;
