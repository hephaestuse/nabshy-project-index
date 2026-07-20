import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nabshy Project Index",
  description: "see the projects and download the latest jornals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
