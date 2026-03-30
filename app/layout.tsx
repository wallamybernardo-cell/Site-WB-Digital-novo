import type {Metadata} from 'next';
import {Inter, Space_Grotesk} from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'WB Digital Hub | Marketing Digital Futurista',
  description: 'Agência de marketing digital futurista. Resultados reais com tráfego pago, SEO e sites de alta conversão para todo o Brasil.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased">
        <div className="noise" />
        {children}
      </body>
    </html>
  );
}
