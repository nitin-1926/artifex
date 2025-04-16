import '~/styles/globals.css';
import { Manrope, Syne } from 'next/font/google';
import { type Metadata } from 'next';
import { ThemeProvider } from '~/components/providers/theme-provider';

export const metadata: Metadata = {
	title: 'Artifex',
	description: 'Artifex',
	icons: [{ rel: 'icon', url: '/artifex-logo.ico' }],
};

const manrope = Manrope({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-body',
});

const syne = Syne({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-display',
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${manrope.variable} ${syne.variable} min-h-dvh bg-background text-foreground antialiased`}
			>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
