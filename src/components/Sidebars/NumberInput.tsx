import React, { type ChangeEvent, type ReactNode, useEffect, useState } from 'react';

const NumberInput = ({
	value,
	onChange,
	min,
	max,
	icon,
	classNames,
}: {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	icon: ReactNode;
	classNames?: string;
}) => {
	const [inputValue, setInputValue] = useState(value.toString());

	useEffect(() => {
		setInputValue(value.toString());
	}, [value]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleCommit = () => {
		const newValue = parseFloat(inputValue);

		if (isNaN(newValue)) {
			setInputValue(value.toString());
			return;
		}

		const clampedValue = Math.min(max ?? newValue, Math.max(min ?? newValue, newValue));
		setInputValue(clampedValue.toString());
		onChange(clampedValue);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleCommit();
			(e.currentTarget as HTMLInputElement).blur();
		}
	};

	return (
		<div className={`relative h-fit ${classNames ?? 'w-28'}`}>
			<input
				type="number"
				value={inputValue}
				onChange={handleChange}
				onBlur={handleCommit}
				onKeyDown={handleKeyDown}
				min={min}
				max={max}
				className="figma-control w-full pl-8 text-[11px] text-[#f4f4f5]"
			/>
			{React.isValidElement(icon) && icon.type === 'p' ? (
				<p className="absolute left-3 top-[50%] -translate-y-1/2 text-[10px] font-medium text-[#9a9a9d]">
					{(icon as React.ReactElement<{ children: React.ReactNode }>).props.children}
				</p>
			) : (
				React.cloneElement(icon as React.ReactElement, {
					className: 'absolute left-2.5 top-[50%] h-3.5 w-3.5 -translate-y-1/2 text-[#9a9a9d]',
				})
			)}
		</div>
	);
};

export default NumberInput;
