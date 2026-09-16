import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roca de Sión · Conectando Vidas",
  description: "Sistema de encuestas de salud y seguimiento congregacional IASD Roca de Sión",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f5f7f8] text-[#18302a] antialiased">
        {children}
      </body>
    </html>
  );
}
