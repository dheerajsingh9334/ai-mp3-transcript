import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Audioscribe - AI Audio Transcription",
  description: "Fast and accurate audio transcription powered by Gemini AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="bg-glow-1"></div>
        <div className="bg-glow-2"></div>
        {children}
      </body>
    </html>
  );
}
