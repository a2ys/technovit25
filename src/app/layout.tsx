import { Be_Vietnam_Pro } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "technoVIT'25 | See you in 2026",
  description: "technoVIT'25 has concluded. Thank you for participating.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${beVietnam.className} antialiased bg-black text-white min-h-screen flex flex-col`}
      >
        <main className="flex-1 flex flex-col h-full w-full">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
