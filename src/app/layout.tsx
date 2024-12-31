import '~/styles/globals.css';
import { Inter } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
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
		<html lang="en" className={`${inter.className}`}>
			<body className="overflow-hidden overscroll-none">{children}</body>
		</html>
	);
}
