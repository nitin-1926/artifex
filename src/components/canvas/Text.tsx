import { useMutation } from '@liveblocks/react';
import { useEffect, useRef, useState } from 'react';
import { type TextLayer } from '~/types';
import { rgbToHex } from '~/utils';

const Text = ({ id, layer }: { id: string; layer: TextLayer }) => {
	const { x, y, width, height, text, fontSize, fontFamily, fontWeight, fill, stroke, opacity } = layer;

	const [isEditing, setIsEditing] = useState(false);
	const [textValue, setTextValue] = useState(text);
	const inputRef = useRef<HTMLInputElement>(null);

	const updateText = useMutation(
		({ storage }, newText: string) => {
			const liveLayers = storage.get('layers');
			const layer = liveLayers.get(id);
			if (!layer) return;
			layer.update({ text: newText });
		},
		[id],
	);

	const handleDoubleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsEditing(true);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTextValue(e.target.value);
	};

	const handleBlur = () => {
		setIsEditing(false);
		updateText(textValue);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			setIsEditing(false);
			updateText(textValue);
		}
	};

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditing]);

	return (
		<g
			onDoubleClick={handleDoubleClick}
			onPointerDown={e => isEditing && e.stopPropagation()}
			onPointerUp={e => isEditing && e.stopPropagation()}
		>
			{isEditing ? (
				<foreignObject
					x={x}
					y={y}
					width={width}
					height={height}
					onPointerDown={e => e.stopPropagation()}
					onPointerUp={e => e.stopPropagation()}
				>
					<input
						ref={inputRef}
						type="text"
						style={{
							fontSize: `${fontSize}px`,
							color: rgbToHex(fill),
							width: '100%',
							border: 'none',
							outline: 'none',
							background: 'transparent',
						}}
						value={textValue}
						onChange={handleChange}
						onBlur={handleBlur}
						onKeyDown={handleKeyDown}
					/>
				</foreignObject>
			) : (
				<text
					x={x}
					y={y + fontSize}
					fontSize={fontSize}
					fontFamily={fontFamily}
					fontWeight={fontWeight}
					fill={fill ? rgbToHex(fill) : '#ccc'}
					stroke={stroke ? rgbToHex(stroke) : '#ccc'}
					opacity={`${opacity ?? 100}%`}
				>
					{text}
				</text>
			)}
		</g>
	);
};

export default Text;