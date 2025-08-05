import type { Metadata, Viewport } from "next";
import "./globals.css";
import { env } from "@/config/env";
import ClientProviders from "@/components/ClientProviders";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_APP_TITLE,
  description: env.NEXT_PUBLIC_APP_DESCRIPTION,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body className="m-0 p-0">
        <Suspense fallback={null}>
          <ClientProviders>
            {children}
          </ClientProviders>
        </Suspense>
      </body>
    </html>
  );
}
