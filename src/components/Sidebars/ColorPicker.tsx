import { useEffect, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

const ColorPicker = ({
	value,
	onChange,
	className,
}: {
	value: string;
	onChange: (value: string) => void;
	className?: string;
}) => {
	const [inputValue, setInputValue] = useState(value);
	const [isPickerOpen, setIsPickerOpen] = useState(false);
	const pickerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setInputValue(value);
	}, [value]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
				setIsPickerOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [pickerRef]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleCommit = () => {
		if (/^#[0-9a-f]{6}$/i.test(inputValue)) {
			onChange(inputValue);
		} else {
			setInputValue(value);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleCommit();
			(e.currentTarget as HTMLInputElement).blur();
		}
	};

	const handleColorChange = (color: string) => {
		setInputValue(color);
		onChange(color);
	};

	return (
		<div ref={pickerRef} className={`relative h-fit ${className ?? 'w-28'}`}>
			<input
				type="text"
				value={inputValue}
				onChange={handleChange}
				onBlur={handleCommit}
				onKeyDown={handleKeyDown}
				className="figma-control w-full pl-8 text-[11px] text-foreground"
			/>
			<div
				style={{ backgroundColor: inputValue }}
				onClick={() => setIsPickerOpen(!isPickerOpen)}
				className="absolute left-2.5 top-[50%] h-3.5 w-3.5 -translate-y-1/2 cursor-pointer rounded-full border border-border"
			/>
			{isPickerOpen && (
				<div className="absolute right-0 z-10 mt-2 -translate-x-[125px] rounded-[0.55rem] border border-border bg-card p-3 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.42)]">
					<HexColorPicker color={inputValue} onChange={handleColorChange} />
				</div>
			)}
		</div>
	);
};

export default ColorPicker;
