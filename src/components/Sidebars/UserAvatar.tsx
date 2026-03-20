import { cn } from '~/lib/utils';

const UserAvatar = ({ name, color, className = '' }: { name: string; color?: string; className?: string }) => {
	return (
		<div
			className={cn(
				'flex min-h-7 min-w-7 items-center justify-center rounded-full border border-white/30 text-[10px] font-medium text-white shadow-[0_6px_14px_-12px_rgba(0,0,0,0.55)]',
				className,
			)}
			style={{ backgroundColor: color ? color : '#3b82f6' }}
		>
			{name.length >= 1 ? name[0]?.toUpperCase() : ''}
		</div>
	);
};

export default UserAvatar;
