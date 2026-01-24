import type { Metadata } from "next";
import { Geist, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { BranchProvider } from "@/contexts/BranchContext";
import { UIProvider } from "@/contexts/UIContext";
import BottomNav from "@/components/navbar/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La Huequita Quiteña | Licores Premium y de Barrio en Quito",
  description: "La mejor selección de licores en Quito con envío a domicilio via WhatsApp. Garantía de originalidad y entregas rápidas.",
  openGraph: {
    title: "La Huequita Quiteña | Licores Premium en Quito",
    description: "La mejor selección de licores en Quito con envío a domicilio. ¡Pide lo tuyo por WhatsApp!",
    url: "https://lahuequitaquitena.com",
    siteName: "La Huequita Quiteña",
    images: [
      {
        url: "/logo-icon.png", // Next.js will resolve from public
        width: 1024,
        height: 888,
        alt: "La Huequita Quiteña Logo",
      },
    ],
    locale: "es_EC",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "La Huequita Quiteña | Licores Premium",
    description: "Licores originales a domicilio en Quito.",
    images: ["/logo-icon.png"],
  },
};

import AgeGate from "@/components/AgeGate";
import Footer from "@/components/common/Footer";
import ToastContainer from "@/components/ui/ToastContainer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      </head>
      <body
        className={`${geistSans.variable} ${playfair.variable} ${plusJakarta.variable} antialiased selection:bg-primary selection:text-black`}
      >
        <BranchProvider>
          <UIProvider>
            <CartProvider>
              <AgeGate>
                <div className="min-h-screen flex flex-col">
                  <main className="flex-grow">
                    {children}
                  </main>
                  <Footer />
                  <BottomNav />
                  <ToastContainer />
                </div>
              </AgeGate>
            </CartProvider>
          </UIProvider>
        </BranchProvider>
      </body>
    </html>
  );
}
