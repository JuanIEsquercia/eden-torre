import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://edentorre.com'),
  title: {
    default: "Torre EDEN | Departamentos del Pozo en Corrientes",
    template: "%s | Torre EDEN"
  },
  description: "Torre EDEN: desarrollo inmobiliario del pozo en Corrientes Capital. Departamentos de 1 y 2 ambientes con amenities premium. Financiación propia hasta 84 cuotas. Invertí hoy.",
  keywords: [
    "departamentos del pozo Corrientes",
    "desarrollo del pozo Corrientes",
    "departamentos en venta Corrientes",
    "desarrollo inmobiliario Corrientes",
    "inversión inmobiliaria Corrientes",
    "comprar departamento Corrientes",
    "departamentos nuevos Corrientes",
    "Torre EDEN Corrientes",
    "departamentos Corrientes Capital",
    "pozo Corrientes",
  ],
  authors: [{ name: "Torre EDEN" }],
  verification: {
    google: "gxfFDx3JP6YWyCQNl0zVrOYTJ6JTOONcB6pYULBLbYo",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "Torre EDEN",
    title: "Torre EDEN | Departamentos del Pozo en Corrientes",
    description: "Desarrollo inmobiliario del pozo en Corrientes. Departamentos de 1 y 2 ambientes, amenities premium y financiación a medida. Invertí desde el pozo.",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Torre EDEN - Desarrollo del Pozo en Corrientes',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Torre EDEN | Departamentos del Pozo en Corrientes",
    description: "Desarrollo inmobiliario del pozo en Corrientes. Financiación propia hasta 84 cuotas.",
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Torre EDEN',
              url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://edentorre.com',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://edentorre.com'}/og-image.jpg`,
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Gdor. Raúl Castillo 2149',
                addressLocality: 'Corrientes',
                addressRegion: 'Corrientes',
                addressCountry: 'AR',
              },
              description: 'Desarrollo inmobiliario del pozo en Corrientes Capital. Departamentos de 1 y 2 ambientes con amenities premium y financiación propia.',
            })
          }}
        />
        {children}
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
    </html>
  );
}
