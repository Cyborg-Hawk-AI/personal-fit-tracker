import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Personal Fit Tracker',
  description: 'Personal training operating system — workouts, nutrition, progress',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
