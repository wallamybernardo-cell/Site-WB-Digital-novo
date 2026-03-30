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
  title: 'WB Digital Hub | Agência de Marketing Digital Futurista',
  description: 'Agência de marketing digital futurista. Resultados reais com tráfego pago, SEO e sites de alta conversão para todo o Brasil.',
  keywords: ['marketing digital', 'tráfego pago', 'SEO', 'criação de sites', 'agência de marketing', 'WB Digital Hub'],
  authors: [{ name: 'WB Digital Hub' }],
  creator: 'WB Digital Hub',
  publisher: 'WB Digital Hub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://ais-dev-yzhdabquq5lgn4p5e5l2y4-324262289559.us-east1.run.app',
  },
  openGraph: {
    title: 'WB Digital Hub | Marketing Digital Futurista',
    description: 'Resultados reais com tráfego pago, SEO e sites de alta conversão.',
    url: 'https://ais-dev-yzhdabquq5lgn4p5e5l2y4-324262289559.us-east1.run.app',
    siteName: 'WB Digital Hub',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WB Digital Hub | Marketing Digital Futurista',
    description: 'Resultados reais com tráfego pago, SEO e sites de alta conversão.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'WB Digital Hub',
    image: 'https://ais-dev-yzhdabquq5lgn4p5e5l2y4-324262289559.us-east1.run.app/logo.png',
    '@id': 'https://ais-dev-yzhdabquq5lgn4p5e5l2y4-324262289559.us-east1.run.app',
    url: 'https://ais-dev-yzhdabquq5lgn4p5e5l2y4-324262289559.us-east1.run.app',
    telephone: '+5582988352548',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Maceió',
      addressRegion: 'AL',
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -9.6658,
      longitude: -35.7353,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday'
      ],
      opens: '09:00',
      closes: '18:00'
    },
    sameAs: [
      'https://www.instagram.com/wbdigitaloficial'
    ]
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Preciso assinar um contrato longo de fidelidade?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Não. Na WB Digital Hub trabalhamos sem contratos de fidelidade. Você pode cancelar a qualquer momento com 30 dias de aviso prévio. Acreditamos que a melhor forma de fidelizar clientes é entregando resultados, não prendendo com papel.'
        }
      },
      {
        '@type': 'Question',
        name: 'Em quanto tempo vejo os primeiros resultados?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Com tráfego pago, os primeiros resultados aparecem em 7 a 14 dias após o início das campanhas. Com SEO e social media, os resultados são progressivos e mais sólidos, normalmente entre 30 e 90 dias. Você verá sinais de melhora desde o primeiro mês.'
        }
      },
      {
        '@type': 'Question',
        name: 'Vocês atendem empresas fora de Maceió?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim! Atendemos negócios em todo o Brasil. Nossa estrutura é 100% digital e temos clientes em diversas regiões do país, entregando a mesma qualidade e performance independente da localização.'
        }
      },
      {
        '@type': 'Question',
        name: 'Existe alguma garantia de resultado?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nenhuma agência séria pode garantir um número específico de vendas, pois isso depende de muitos fatores externos. O que garantimos é: estratégia baseada em dados, transparência total, relatórios semanais e dedicação máxima.'
        }
      }
    ]
  };

  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <div className="noise" />
        {children}
      </body>
    </html>
  );
}
