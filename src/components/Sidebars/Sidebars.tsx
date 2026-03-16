'use client';

import { useMutation, useOthers, useSelf, useStorage } from '@liveblocks/react';
import { RoomVisibility, type User } from '@prisma/client';
import Link from 'next/link';
import { ArrowLeft, Download, Image as ImageIcon, ImageDown } from 'lucide-react';
import { useState } from 'react';
import { AiOutlineFontSize } from 'react-icons/ai';
import { BsCircleHalf } from 'react-icons/bs';
import { IoEllipseOutline, IoSquareOutline } from 'react-icons/io5';
import { PiPathLight, PiSidebarSimpleThin } from 'react-icons/pi';
import { RiRoundedCorner } from 'react-icons/ri';
import { type Color, LayerType } from '~/types';
import { connectionIdToColor, hexToRgb, rgbToHex } from '~/utils';
import ColorPicker from './ColorPicker';
import Dropdown from './Dropdown';
import LayerButton from './LayerButton';
import NumberInput from './NumberInput';
import UserAvatar from './UserAvatar';
import ShareMenu from './ShareMenu';

const PANEL_CLASS =
	'pointer-events-auto flex h-full flex-col border border-border bg-card text-foreground';

const SideBars = ({
	leftIsMinimized,
	setLeftIsMinimized,
	roomName,
	roomId,
	othersWithAccess,
	roomOwner,
	roomVisibility,
	canManageRoom,
	onVisibilityChange,
	onExport,
}: {
	leftIsMinimized: boolean;
	setLeftIsMinimized: (value: boolean) => void;
	roomName: string;
	roomId: string;
	othersWithAccess: User[];
	roomOwner: Pick<User, 'id' | 'email' | 'name'>;
	roomVisibility: RoomVisibility;
	canManageRoom: boolean;
	onVisibilityChange: (visibility: RoomVisibility) => void;
	onExport: (format: 'png' | 'jpeg') => void;
}) => {
	const others = useOthers();
	const [showExportMenu, setShowExportMenu] = useState(false);

	const me = useSelf();
	const selectedLayer = useSelf(self => {
		const selection = self.presence.selection;
		return selection.length === 1 ? selection[0] : null;
	});
	const selection = useSelf(self => self.presence.selection);

	const layer = useStorage(storage => {
		if (!selectedLayer) return null;
		return storage.layers.get(selectedLayer);
	});
	const roomColor = useStorage(storage => storage.roomColor);
	const layers = useStorage(storage => storage.layers);
	const layerIds = useStorage(storage => storage.layerIds);
	const reversedLayerIds = [...(layerIds ?? [])].reverse();

	const setRoomColor = useMutation(({ storage }, newColor: Color) => {
		storage.set('roomColor', newColor);
	}, []);

	const updateLayer = useMutation(
		(
			{ storage },
			updates: {
				x?: number;
				y?: number;
				width?: number;
				height?: number;
				opacity?: number;
				cornerRadius?: number;
				fill?: string;
				stroke?: string;
				fontSize?: number;
				fontWeight?: number;
				fontFamily?: string;
			},
		) => {
			if (!selectedLayer) return;
			const liveLayers = storage.get('layers');
			const layer = liveLayers.get(selectedLayer);
			if (layer) {
				layer.update({
					...(updates.x !== undefined && { x: updates.x }),
					...(updates.y !== undefined && { y: updates.y }),
					...(updates.width !== undefined && { width: updates.width }),
					...(updates.height !== undefined && { height: updates.height }),
					...(updates.opacity !== undefined && { opacity: updates.opacity }),
					...(updates.cornerRadius !== undefined && { cornerRadius: updates.cornerRadius }),
					...(updates.fill !== undefined && { fill: hexToRgb(updates.fill) }),
					...(updates.stroke !== undefined && { stroke: hexToRgb(updates.stroke) }),
					...(updates.fontSize !== undefined && { fontSize: updates.fontSize }),
					...(updates.fontWeight !== undefined && { fontWeight: updates.fontWeight }),
					...(updates.fontFamily !== undefined && { fontFamily: updates.fontFamily }),
				});
			}
		},
		[selectedLayer],
	);

	return (
		<>
			{/* Left Sidebar */}
			{!leftIsMinimized ? (
				<div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex">
					<div className={`${PANEL_CLASS} w-[240px] border-l-0`}>
						<div className="p-3">
							<div className="flex justify-between">
								<Link
									href="/dashboard"
									className="inline-flex h-8 w-8 items-center justify-center rounded-[0.45rem] border border-border bg-background text-muted-foreground transition hover:border-primary/40 hover:text-primary"
									aria-label="Back to dashboard"
								>
									<ArrowLeft className="h-4 w-4" />
								</Link>
								<button
									type="button"
									aria-label="Collapse left sidebar"
									onClick={() => setLeftIsMinimized(true)}
									className="rounded-[0.45rem] p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45"
								>
									<PiSidebarSimpleThin className="h-4 w-4" />
								</button>
							</div>
							<p className="mt-4 text-[10px] font-medium uppercase tracking-[0.11em] text-muted-foreground">
								Canvas room
							</p>
							<h2 className="mt-1.5 scroll-m-20 text-[12px] font-medium text-foreground">{roomName}</h2>
						</div>
						<div className="border-b border-border" />
						<div className="flex flex-col gap-1 p-2.5">
							<span className="mb-1.5 px-1 text-[10px] font-medium uppercase tracking-[0.11em] text-muted-foreground">
								Layers
							</span>
							{layerIds &&
								reversedLayerIds.map(id => {
									const layer = layers?.get(id);
									const isSelected = selection?.includes(id);
									if (layer?.type === LayerType.Rectangle) {
										return (
											<LayerButton
												key={id}
												layerId={id}
												text="Rectangle"
												isSelected={isSelected ?? false}
												icon={<IoSquareOutline className="h-3 w-3 text-muted-foreground" />}
											/>
										);
									} else if (layer?.type === LayerType.Ellipse) {
										return (
											<LayerButton
												key={id}
												layerId={id}
												text="Ellipse"
												isSelected={isSelected ?? false}
												icon={<IoEllipseOutline className="h-3 w-3 text-muted-foreground" />}
											/>
										);
									} else if (layer?.type === LayerType.Path) {
										return (
											<LayerButton
												key={id}
												layerId={id}
												text="Drawing"
												isSelected={isSelected ?? false}
												icon={<PiPathLight className="h-3 w-3 text-muted-foreground" />}
											/>
										);
									} else if (layer?.type === LayerType.Text) {
										return (
											<LayerButton
												key={id}
												layerId={id}
												text="Text"
												isSelected={isSelected ?? false}
												icon={<AiOutlineFontSize className="h-3 w-3 text-muted-foreground" />}
											/>
										);
									}
								})}
						</div>
					</div>
				</div>
			) : (
				<div className="pointer-events-none absolute left-0 top-0 z-10">
					<div className="pointer-events-auto flex h-[44px] w-[240px] items-center justify-between border-b border-r border-border bg-card px-3.5 text-foreground">
						<Link
							href="/dashboard"
							className="inline-flex h-8 w-8 items-center justify-center rounded-[0.45rem] border border-border bg-background text-muted-foreground transition hover:border-primary/40 hover:text-primary"
							aria-label="Back to dashboard"
						>
							<ArrowLeft className="h-4 w-4" />
						</Link>
						<h2 className="scroll-m-20 text-[12px] font-medium">{roomName}</h2>
						<button
							type="button"
							aria-label="Expand left sidebar"
							onClick={() => setLeftIsMinimized(false)}
							className="rounded-[0.45rem] p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45"
						>
							<PiSidebarSimpleThin className="h-4 w-4" />
						</button>
					</div>
				</div>
			)}

			{/* Right Sidebar */}
			{!leftIsMinimized || layer ? (
				<div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex">
					<div className={`${PANEL_CLASS} w-[296px] border-r-0`}>
						<div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
							<div className="max-36 flex w-full -space-x-2 overflow-x-auto p-2 text-xs">
								{me && <UserAvatar color={connectionIdToColor(me.connectionId)} name={me.info.name} />}
								{others.map(other => (
									<UserAvatar
										key={other.connectionId}
										color={connectionIdToColor(other.connectionId)}
										name={other.info.name}
									/>
								))}
							</div>
							<div className="relative flex items-center gap-1.5">
								<button
									type="button"
									onClick={() => setShowExportMenu(prev => !prev)}
									className="inline-flex h-7 w-7 items-center justify-center rounded-[0.45rem] border border-border bg-background text-muted-foreground transition hover:border-primary/50 hover:text-primary"
									aria-label="Export design"
								>
									<Download className="h-3.5 w-3.5" />
								</button>
								{showExportMenu && (
									<div className="absolute right-0 top-[calc(100%+0.35rem)] z-30 flex w-[136px] flex-col gap-1 rounded-[0.5rem] border border-border bg-card p-1 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.65)]">
										<button
											type="button"
											onClick={() => {
												onExport('png');
												setShowExportMenu(false);
											}}
											className="flex items-center gap-2 rounded-[0.45rem] px-2 py-1.5 text-[11px] text-foreground transition hover:bg-muted"
										>
											<ImageDown className="h-3.5 w-3.5" />
											Export PNG
										</button>
										<button
											type="button"
											onClick={() => {
												onExport('jpeg');
												setShowExportMenu(false);
											}}
											className="flex items-center gap-2 rounded-[0.45rem] px-2 py-1.5 text-[11px] text-foreground transition hover:bg-muted"
										>
											<ImageIcon className="h-3.5 w-3.5" />
											Export JPEG
										</button>
									</div>
								)}
								{canManageRoom && (
									<ShareMenu
										roomId={roomId}
										roomName={roomName}
										roomVisibility={roomVisibility}
										owner={roomOwner}
										othersWithAccessToRoom={othersWithAccess}
									/>
								)}
							</div>
						</div>
						{layer ? (
							<>
								<div className="flex flex-col gap-2 p-3.5">
									<span className="mb-1 text-[10px] font-medium uppercase tracking-[0.11em] text-muted-foreground">
										Position
									</span>
									<div className="flex flex-col gap-1">
										<p className="text-[10px] font-medium text-muted-foreground">Position</p>
										<div className="flex w-full gap-2">
											<NumberInput
												value={layer.x}
												onChange={number => {
													updateLayer({ x: number });
												}}
												classNames="w-1/2"
												icon={<p>X</p>}
											/>
											<NumberInput
												value={layer.y}
												onChange={number => {
													updateLayer({ y: number });
												}}
												classNames="w-1/2"
												icon={<p>Y</p>}
											/>
										</div>
									</div>
								</div>

								{layer.type !== LayerType.Path && (
									<>
										<div className="border-b border-border" />
										<div className="flex flex-col gap-2 p-3.5">
											<span className="mb-1 text-[10px] font-medium uppercase tracking-[0.11em] text-muted-foreground">
												Layout
											</span>
											<div className="flex flex-col gap-1">
												<p className="text-[10px] font-medium text-muted-foreground">Dimensions</p>
												<div className="flex w-full gap-2">
													<NumberInput
														value={layer.width}
														onChange={number => {
															updateLayer({ width: number });
														}}
														classNames="w-1/2"
														icon={<p>W</p>}
													/>
													<NumberInput
														value={layer.height}
														onChange={number => {
															updateLayer({ height: number });
														}}
														classNames="w-1/2"
														icon={<p>H</p>}
													/>
												</div>
											</div>
										</div>
									</>
								)}

								<div className="border-b border-border" />
								<div className="flex flex-col gap-2 p-3.5">
									<span className="mb-1 text-[10px] font-medium uppercase tracking-[0.11em] text-muted-foreground">
										Appearance
									</span>
									<div className="flex w-full gap-2">
										<div className="flex w-1/2 flex-col gap-1">
											<p className="text-[10px] font-medium text-muted-foreground">Opacity</p>
											<NumberInput
												value={layer.opacity}
												min={0}
												max={100}
												onChange={number => {
													updateLayer({ opacity: number });
												}}
												classNames="w-full"
												icon={<BsCircleHalf />}
											/>
										</div>
										{layer.type === LayerType.Rectangle && (
											<div className="flex w-1/2 flex-col gap-1">
												<p className="text-[10px] font-medium text-muted-foreground">Corner radius</p>
												<NumberInput
													value={layer.cornerRadius ?? 0}
													min={0}
													max={100}
													onChange={number => {
														updateLayer({ cornerRadius: number });
													}}
													classNames="w-full"
													icon={<RiRoundedCorner />}
												/>
											</div>
										)}
									</div>
								</div>
								<div className="border-b border-border" />
								<div className="flex flex-col gap-2 p-3.5">
									<span className="mb-1 text-[10px] font-medium uppercase tracking-[0.11em] text-muted-foreground">
										Fill
									</span>
									<ColorPicker
										value={rgbToHex(layer.fill)}
										onChange={color => {
											updateLayer({ fill: color, stroke: color });
										}}
									/>
								</div>
								<div className="border-b border-border" />
								<div className="flex flex-col gap-2 p-3.5">
									<span className="mb-1 text-[10px] font-medium uppercase tracking-[0.11em] text-muted-foreground">
										Stroke
									</span>
									<ColorPicker
										value={rgbToHex(layer.stroke)}
										onChange={color => {
											updateLayer({ stroke: color });
										}}
									/>
								</div>
								{layer.type === LayerType.Text && (
									<>
										<div className="border-b border-border" />
										<div className="flex flex-col gap-2 p-3.5">
											<span className="mb-1 text-[10px] font-medium uppercase tracking-[0.11em] text-muted-foreground">
												Typography
											</span>
											<div className="flex flex-col gap-2">
												<Dropdown
													value={layer.fontFamily}
													onChange={value => {
														updateLayer({ fontFamily: value });
													}}
													options={['Inter', 'Arial', 'Times New Roman']}
												/>
												<div className="flex w-full gap-2">
													<div className="flex w-full flex-col gap-1">
														<p className="text-[10px] font-medium text-muted-foreground">Size</p>
														<NumberInput
															value={layer.fontSize}
															onChange={number => {
																updateLayer({ fontSize: number });
															}}
															classNames="w-full"
															icon={<p>W</p>}
														/>
													</div>
													<div className="flex w-full flex-col gap-1">
														<p className="text-[10px] font-medium text-muted-foreground">Weight</p>
														<Dropdown
															value={layer.fontWeight.toString()}
															onChange={value => {
																updateLayer({ fontWeight: Number(value) });
															}}
															options={[
																'100',
																'200',
																'300',
																'400',
																'500',
																'600',
																'700',
																'800',
																'900',
															]}
														/>
													</div>
												</div>
											</div>
										</div>
									</>
								)}
							</>
						) : (
							<div className="flex flex-col gap-2 p-3.5">
								<span className="mb-1 text-[10px] font-medium uppercase tracking-[0.11em] text-muted-foreground">
									Page
								</span>
								{canManageRoom && (
									<div className="mb-1 flex items-center gap-2">
										<button
											type="button"
											onClick={() =>
												onVisibilityChange(
													roomVisibility === RoomVisibility.PUBLIC
														? RoomVisibility.PRIVATE
														: RoomVisibility.PUBLIC,
												)
											}
											className="inline-flex h-7 items-center gap-1 rounded-[0.45rem] border border-border bg-background px-2 text-[10px] text-muted-foreground transition hover:border-primary/40 hover:text-primary"
										>
											{roomVisibility === RoomVisibility.PUBLIC ? 'Public' : 'Private'}
										</button>
									</div>
								)}
								<ColorPicker
									onChange={color => {
										const rgbColor = hexToRgb(color);
										setRoomColor(rgbColor);
									}}
									value={roomColor ? rgbToHex(roomColor) : '#eceef2'}
								/>
							</div>
						)}
					</div>
				</div>
			) : (
				<div className="pointer-events-none absolute right-0 top-0 z-10">
					<div className="pointer-events-auto flex h-[44px] w-[296px] items-center justify-between border-b border-l border-border bg-card pr-2 text-foreground">
						<div className="max-36 flex w-full -space-x-2 overflow-x-auto p-2 text-xs">
							{me && <UserAvatar color={connectionIdToColor(me.connectionId)} name={me.info.name} />}
							{others.map(other => (
								<UserAvatar
									key={other.connectionId}
									color={connectionIdToColor(other.connectionId)}
									name={other.info.name}
								/>
							))}
						</div>
						{canManageRoom && (
							<ShareMenu
								roomId={roomId}
								roomName={roomName}
								roomVisibility={roomVisibility}
								owner={roomOwner}
								othersWithAccessToRoom={othersWithAccess}
							/>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default SideBars;
