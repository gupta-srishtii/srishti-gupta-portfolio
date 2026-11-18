import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Srishti Gupta — The Enchanted Atelier',
  description:
    'Step into the creative atelier of Srishti Gupta, a CSE AI/ML student exploring code, design, painting, and storytelling.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
