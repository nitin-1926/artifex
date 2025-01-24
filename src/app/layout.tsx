import '~/styles/globals.css';
import { Inter } from 'next/font/google';
import { type Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Artifex',
	description: 'Artifex',
	icons: [{ rel: 'icon', url: '/artifex-logo.ico' }],
};

const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${inter.className} dark`}>
			<body className="overflow-hidden overscroll-none dark:bg-black">{children}</body>
		</html>
	);
}
