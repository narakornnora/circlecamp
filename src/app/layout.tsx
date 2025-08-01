import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CircleCamp - AI Website Builder",
  description: "ระบบสร้างเว็บไซต์ด้วย AI ที่ฉลาดและตอบโจทย์คนอยากมีเว็บแบบมืออาชีพ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
