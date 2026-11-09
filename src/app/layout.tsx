import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Echo Dashboard",
  description:
    "Fullscreen clock, weather, agenda and photo slideshow dashboard for the Echo Show 8.",
  manifest: "/manifest.json",
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#080c14",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${jakarta.variable} ${space.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        {children}
        {/* Service worker only in production, so dev builds are never cached */}
        {process.env.NODE_ENV === "production" && (
          <Script id="register-sw" strategy="afterInteractive">
            {`if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js");`}
          </Script>
        )}
      </body>
    </html>
  );
}
