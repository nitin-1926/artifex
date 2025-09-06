import { GrUndo } from 'react-icons/gr';
import IconButton from './IconButton';

const UndoButton = ({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) => {
	return (
		<IconButton onClick={onClick} disabled={disabled} label="Undo">
			<GrUndo size={18} />
		</IconButton>
	);
};

export default UndoButton;
