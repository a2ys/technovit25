"use client";

import { Be_Vietnam_Pro } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { useState, useEffect } from "react";
import Image from "next/image";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import MiniChatbot from "@/components/MiniChatbot";
import { Button } from "@/components/ui/button";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsScrollTopVisible(true);
      } else {
        setIsScrollTopVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          technovit&apos;25 | VIT Chennai&apos;s Annual Technical Fest
        </title>
        <meta
          name="description"
          content="technovit'25 - VIT Chennai's Annual Technical Fest. Join us for an exhilarating experience of innovation, technology, and creativity. Explore workshops, competitions, and guest lectures by industry experts. Unleash your potential and be part of the future!"
        />
        <meta
          property="og:title"
          content="technovit'25 | VIT Chennai's Annual Technical Fest"
        />
        <meta
          property="og:description"
          content="technovit'25 - VIT Chennai's Annual Technical Fest. Join us for an exhilarating experience of innovation, technology, and creativity."
        />
      </head>
      <body
        className={`${beVietnam.className} antialiased bg-black relative min-h-[100svh]`}
      >
        <div className="flex flex-col min-h-screen w-full">
          <Navigation />
          <main className="flex-1">
            {children}
            <ScrollToTop />
          </main>
          <Footer />
        </div>
        {isChatbotOpen ? (
          <MiniChatbot onClose={() => setIsChatbotOpen(false)} />
        ) : (
          <Button
            onClick={() => setIsChatbotOpen(true)}
            className={`fixed right-8 z-50 h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 p-0 overflow-hidden transition-all duration-300 hover:scale-110 ${
              isScrollTopVisible ? "bottom-24" : "bottom-8"
            }`}
            size="icon"
          >
            <Image
              src="/chatbot-logo.png"
              alt="Chatbot"
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          </Button>
        )}
        <Analytics />
      </body>
    </html>
  );
}
