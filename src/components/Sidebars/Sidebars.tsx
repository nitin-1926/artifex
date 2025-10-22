'use client';

import { useMutation, useOthers, useSelf, useStorage } from '@liveblocks/react';
import { type User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
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

const SideBars = ({
	leftIsMinimized,
	setLeftIsMinimized,
	roomName,
	roomId,
	othersWithAccess,
}: {
	leftIsMinimized: boolean;
	setLeftIsMinimized: (value: boolean) => void;
	roomName: string;
	roomId: string;
	othersWithAccess: User[];
}) => {
	const others = useOthers();

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
				<div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex p-2.5">
					<div className="pointer-events-auto flex w-[228px] flex-col rounded-[0.85rem] border border-[#d7d8dc] bg-[#f7f7f8]/98 text-[#111827] shadow-[0_16px_34px_-28px_rgba(15,23,42,0.28)] backdrop-blur-sm">
						<div className="p-3.5">
							<div className="flex justify-between">
								<Link href="/dashboard">
									<Image src="/artifex-logo.ico" alt="Artifex" width={18} height={18} />
								</Link>
								<button
									type="button"
									aria-label="Collapse left sidebar"
									onClick={() => setLeftIsMinimized(true)}
									className="rounded-[0.55rem] p-1 text-[#6b7280] transition hover:bg-[#eceef2] hover:text-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								>
									<PiSidebarSimpleThin className="h-4 w-4" />
								</button>
							</div>
							<p className="mt-4 text-[10px] font-medium uppercase tracking-[0.12em] text-[#6b7280]">
								Canvas room
							</p>
							<h2 className="mt-1.5 scroll-m-20 text-[13px] font-semibold text-[#111827]">{roomName}</h2>
						</div>
						<div className="border-b border-[#e4e4e7]" />
						<div className="flex flex-col gap-1 p-2.5">
							<span className="mb-1.5 px-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#6b7280]">
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
												icon={<IoSquareOutline className="h-3 w-3 text-[#9ca3af]" />}
											/>
										);
									} else if (layer?.type === LayerType.Ellipse) {
										return (
											<LayerButton
												key={id}
												layerId={id}
												text="Ellipse"
												isSelected={isSelected ?? false}
												icon={<IoEllipseOutline className="h-3 w-3 text-[#9ca3af]" />}
											/>
										);
									} else if (layer?.type === LayerType.Path) {
										return (
											<LayerButton
												key={id}
												layerId={id}
												text="Drawing"
												isSelected={isSelected ?? false}
												icon={<PiPathLight className="h-3 w-3 text-[#9ca3af]" />}
											/>
										);
									} else if (layer?.type === LayerType.Text) {
										return (
											<LayerButton
												key={id}
												layerId={id}
												text="Text"
												isSelected={isSelected ?? false}
												icon={<AiOutlineFontSize className="h-3 w-3 text-[#9ca3af]" />}
											/>
										);
									}
								})}
						</div>
					</div>
				</div>
			) : (
				<div className="pointer-events-none absolute left-0 top-0 z-10 p-2.5">
					<div className="pointer-events-auto flex h-[46px] w-[228px] items-center justify-between rounded-[0.85rem] border border-[#d7d8dc] bg-[#f7f7f8]/98 px-3.5 text-[#111827] shadow-[0_16px_34px_-28px_rgba(15,23,42,0.28)] backdrop-blur-sm">
						<Link href="/dashboard">
							<Image src="/artifex-logo.ico" alt="Artifex" width={18} height={18} />
						</Link>
						<h2 className="scroll-m-20 text-[13px] font-semibold">{roomName}</h2>
						<button
							type="button"
							aria-label="Expand left sidebar"
							onClick={() => setLeftIsMinimized(false)}
							className="rounded-[0.55rem] p-1 text-[#6b7280] transition hover:bg-[#eceef2] hover:text-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							<PiSidebarSimpleThin className="h-4 w-4" />
						</button>
					</div>
				</div>
			)}

			{/* Right Sidebar */}
			{!leftIsMinimized || layer ? (
				<div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex p-2.5">
					<div className="pointer-events-auto flex w-[272px] flex-col rounded-[0.85rem] border border-[#d7d8dc] bg-[#f7f7f8]/98 text-[#111827] shadow-[0_16px_34px_-28px_rgba(15,23,42,0.28)] backdrop-blur-sm">
						<div className="flex items-center justify-between gap-2 px-3 py-2.5">
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
							<ShareMenu roomId={roomId} othersWithAccessToRoom={othersWithAccess} />
						</div>
						<div className="border-b border-[#e4e4e7]"></div>
						{layer ? (
							<>
								<div className="flex flex-col gap-2 p-3.5">
									<span className="mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#6b7280]">
										Position
									</span>
									<div className="flex flex-col gap-1">
										<p className="text-[10px] font-medium text-[#6b7280]">Position</p>
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
										<div className="border-b border-[#e4e4e7]"></div>
										<div className="flex flex-col gap-2 p-3.5">
											<span className="mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#6b7280]">
												Layout
											</span>
											<div className="flex flex-col gap-1">
												<p className="text-[10px] font-medium text-[#6b7280]">Dimensions</p>
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

								<div className="border-b border-[#e4e4e7]"></div>
								<div className="flex flex-col gap-2 p-3.5">
									<span className="mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#6b7280]">
										Appearance
									</span>
									<div className="flex w-full gap-2">
										<div className="flex w-1/2 flex-col gap-1">
											<p className="text-[10px] font-medium text-[#6b7280]">Opacity</p>
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
												<p className="text-[10px] font-medium text-[#6b7280]">Corner radius</p>
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
								<div className="border-b border-[#e4e4e7]" />
								<div className="flex flex-col gap-2 p-3.5">
									<span className="mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#6b7280]">
										Fill
									</span>
									<ColorPicker
										value={rgbToHex(layer.fill)}
										onChange={color => {
											updateLayer({ fill: color, stroke: color });
										}}
									/>
								</div>
								<div className="border-b border-[#e4e4e7]" />
								<div className="flex flex-col gap-2 p-3.5">
									<span className="mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#6b7280]">
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
										<div className="border-b border-[#e4e4e7]" />
										<div className="flex flex-col gap-2 p-3.5">
											<span className="mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#6b7280]">
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
														<p className="text-[10px] font-medium text-[#6b7280]">Size</p>
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
														<p className="text-[10px] font-medium text-[#6b7280]">Weight</p>
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
								<span className="mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#6b7280]">
									Page
								</span>
								<ColorPicker
									onChange={color => {
										const rgbColor = hexToRgb(color);
										setRoomColor(rgbColor);
									}}
									value={roomColor ? rgbToHex(roomColor) : '#1e1e1e'}
								/>
							</div>
						)}
					</div>
				</div>
			) : (
				<div className="pointer-events-none absolute right-0 top-0 z-10 p-2.5">
					<div className="pointer-events-auto flex h-[46px] w-[272px] items-center justify-between rounded-[0.85rem] border border-[#d7d8dc] bg-[#f7f7f8]/98 pr-2 text-[#111827] shadow-[0_16px_34px_-28px_rgba(15,23,42,0.28)] backdrop-blur-sm">
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
						<ShareMenu roomId={roomId} othersWithAccessToRoom={othersWithAccess} />
					</div>
				</div>
			)}
		</>
	);
};

export default SideBars;
