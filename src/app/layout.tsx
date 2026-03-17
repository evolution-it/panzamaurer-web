import type { Metadata } from "next";
import { Hanken_Grotesk, Noto_Sans, Inter } from "next/font/google";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: "Panza Maurer | Attorneys at Law",
  description:
    "Representing Business, Regulated Industries, and Institutions for more than 50 years in Florida.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${hankenGrotesk.variable} ${notoSans.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
