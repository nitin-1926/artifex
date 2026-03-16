import '~/styles/globals.css';
import { Inter } from 'next/font/google';
import { type Metadata } from 'next';
import { ThemeProvider } from '~/components/providers/theme-provider';

export const metadata: Metadata = {
	title: 'Artifex',
	description: 'Artifex',
	icons: [{ rel: 'icon', url: '/artifex-logo.ico' }],
};

const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-body',
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.variable} min-h-dvh bg-background text-foreground antialiased`}>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
