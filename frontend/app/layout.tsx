import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./context/UserContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scope",
  description:
    "A shared workspace for brands and creators to manage agreements, communication, deliverables, licensing, and payments.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "Scope",
    description:
      "A shared workspace for brands and creators to manage agreements, communication, deliverables, licensing, and payments.",
    siteName: "Scope",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
