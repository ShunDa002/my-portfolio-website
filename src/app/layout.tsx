import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HybridBackground } from "@/components/ui/hybrid-background";
import { Header } from "@/components/ui/header";
import { LoadingProvider } from "@/components/providers/loading-provider";
import { LoadingScreen } from "@/components/ui/loading-screen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tay Shon Da | Software Engineering & AI Portfolio",
  description:
    "Software Engineering Student specializing in AI, LLMs, and Computer Vision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The font variables live on <html> because the @theme --font-mono token is
    // declared on :root. Defining them on <body> instead leaves that token
    // referencing an out-of-scope variable, which makes it invalid and silently
    // drops every font-mono utility back to the inherited sans face.
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased text-slate-200 selection:bg-cyan-glow/30 selection:text-cyan-100">
        <LoadingProvider>
          <LoadingScreen />
          <Header />
          <HybridBackground />
          <main className="relative z-20 flex flex-col items-center justify-center min-h-screen">
            {children}
          </main>
        </LoadingProvider>
      </body>
    </html>
  );
}
