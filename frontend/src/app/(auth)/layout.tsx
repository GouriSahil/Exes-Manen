import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import '../globals.css';
import { ThemeProvider } from '../../components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
