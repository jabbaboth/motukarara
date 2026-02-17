import type { Metadata } from "next";
import Navigation from "@/components/layout/Navigation";
import ServiceWorkerRegistration from "@/components/layout/ServiceWorkerRegistration";
import "./globals.css";

export const metadata: Metadata = {
  title: "Motu — Crew Management",
  description:
    "Motukarara Powerline Vegetation Contract Crew Management System",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Motu",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#2E86AB" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </head>
      <body className="font-sans">
        <ServiceWorkerRegistration />
        <Navigation />
        <main className="md:ml-56 pb-20 md:pb-0">
          <div className="max-w-7xl mx-auto px-4 py-6">{children}</div>
        </main>
      </body>
    </html>
  );
}
