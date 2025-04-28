import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BasicNavbar from "@/components/navbar/basicNavbar";
import Footer from "@/components/footer/footer";
import { NavbarProvider } from "@/components/navbar/basicNavbarContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Court Vision",
  description: "Basketball analytics platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F6F6F6]`}
      >
        <NavbarProvider>
          <BasicNavbar />
          {children}
          <Footer />
        </NavbarProvider>
      </body>
    </html>
  );
}
