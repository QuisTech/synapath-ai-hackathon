import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './../styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SynaPath AI',
  description: 'Autonomous IT Incident Management, Orchestrated by UiPath Agents.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-[calc(100vh-128px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
