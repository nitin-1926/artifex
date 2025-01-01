'use client';

import { useMutation, useOthers, useSelf, useStorage } from '@liveblocks/react';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineFontSize } from 'react-icons/ai';
import { IoEllipseOutline, IoSquareOutline } from 'react-icons/io5';
import { PiPathLight, PiSidebarSimpleThin } from 'react-icons/pi';
import { LayerType } from '~/types';
import { hexToRgb } from '~/utils';
import LayerButton from './LayerButton';

const SideBars = ({
	leftIsMinimized,
	setLeftIsMinimized,
}: {
	leftIsMinimized: boolean;
	setLeftIsMinimized: (value: boolean) => void;
}) => {
	const layerIds = useStorage(storage => storage.layerIds);
	const reversedLayerIds = [...(layerIds ?? [])].reverse();

	return (
		<>
			{/* Left Sidebar */}
			{!leftIsMinimized ? (
				<div className="fixed left-0 flex h-screen w-[240px] flex-col border-r border-gray-200 bg-white">
					<div className="p-4">
						<div className="flex justify-between">
							<Link href="/dashboard">
								<Image src="/artifex-logo.ico" alt="Artifex" width={18} height={18} />
							</Link>
							<PiSidebarSimpleThin
								onClick={() => setLeftIsMinimized(true)}
								className="h-5 w-5 cursor-pointer"
							/>
						</div>
						<h2 className="mt-2 scroll-m-20 text-[13px] font-medium">Room name</h2>
					</div>
					<div className="border-b border-gray-200" />
					<div className="flex flex-col gap-1 p-4">
						<span className="mb-2 text-[11px] font-medium">Layers</span>
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
											icon={<IoSquareOutline className="h-3 w-3 text-gray-500" />}
										/>
									);
								} else if (layer?.type === LayerType.Ellipse) {
									return (
										<LayerButton
											key={id}
											layerId={id}
											text="Ellipse"
											isSelected={isSelected ?? false}
											icon={<IoEllipseOutline className="h-3 w-3 text-gray-500" />}
										/>
									);
								} else if (layer?.type === LayerType.Path) {
									return (
										<LayerButton
											key={id}
											layerId={id}
											text="Drawing"
											isSelected={isSelected ?? false}
											icon={<PiPathLight className="h-3 w-3 text-gray-500" />}
										/>
									);
								} else if (layer?.type === LayerType.Text) {
									return (
										<LayerButton
											key={id}
											layerId={id}
											text="Text"
											isSelected={isSelected ?? false}
											icon={<AiOutlineFontSize className="h-3 w-3 text-gray-500" />}
										/>
									);
								}
							})}
					</div>
				</div>
			) : (
				<div className="fixed left-3 top-3 flex h-[48px] w-[250px] items-center justify-between rounded-xl border bg-white p-4">
					<Link href="/dashboard">
						<Image src="/artifex-logo.ico" alt="Artifex" width={18} height={18} />
					</Link>
					<h2 className="scroll-m-20 text-[13px] font-medium">Room name</h2>
					<PiSidebarSimpleThin onClick={() => setLeftIsMinimized(false)} className="h-5 w-5 cursor-pointer" />
				</div>
			)}

			{/* Right Sidebar */}
			<div>Right Sidebar</div>
		</>
	);
};

export default SideBars;
