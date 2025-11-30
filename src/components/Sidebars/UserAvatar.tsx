import { cn } from '~/lib/utils';

const UserAvatar = ({ name, color, className = '' }: { name: string; color?: string; className?: string }) => {
	return (
		<div
			className={cn(
				'flex min-h-8 min-w-8 items-center justify-center rounded-full border border-white/80 text-[11px] font-semibold text-white shadow-[0_8px_18px_-14px_rgba(15,23,42,0.35)]',
				className,
			)}
			style={{ backgroundColor: color ? color : '#3b82f6' }}
		>
			{name.length >= 1 ? name[0]?.toUpperCase() : ''}
		</div>
	);
};

export default UserAvatar;
