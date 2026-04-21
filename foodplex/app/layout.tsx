import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SNACKPLEX — Skip the Queue. Eat Smart.",
  description: "SNACKPLEX Smart Canteen System — Order smarter, eat faster. AI-powered canteen ordering with real-time updates, live queue tracking, and personalized recommendations.",
  keywords: "canteen, food ordering, smart canteen, GSFC University, snackplex",
  openGraph: {
    title: "SNACKPLEX — Skip the Queue. Eat Smart.",
    description: "AI-powered smart canteen ordering system",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
