import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "Torre EDEN | Desarrollo Inmobiliario en Corrientes",
    template: "%s | Torre EDEN"
  },
  description: "Departamentos exclusivos en venta en el corazón de Corrientes. Monoambientes, 1 y 2 dormitorios con amenities premium y financiación a medida. Vivir en EDEN es vivir conectado.",
  keywords: ["departamentos corrientes", "inmobiliaria corrientes", "torre eden", "venta departamentos", "inversión inmobiliaria", "desarrollo al pozo"],
  authors: [{ name: "EDEN Corrientes" }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://torre-eden.com", // Replace with real URL later
    siteName: "Torre EDEN",
    title: "Torre EDEN | Tu próxima inversión en Corrientes",
    description: "Departamentos exclusivos en venta. Diseño moderno, ubicación estratégica y amenities de primera categoría.",
    // images: [{ url: '/og-image.jpg' }], // Placeholder for future OG image
  },
  twitter: {
    card: "summary_large_image",
    title: "Torre EDEN | Desarrollo Inmobiliario en Corrientes",
    description: "Invertí en el desarrollo más exclusivo de la ciudad.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
