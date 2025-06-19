import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const hanken_grotesk = Hanken_Grotesk({
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
        className={`${hanken_grotesk.className} antialiased bg-[var(--MainBackground)]`}
      >
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              borderRadius: "8px",
              padding: "16px",
              fontSize: "16px",
              background: "#333",
              color: "#fff",
            },
            success: {
              style: {
                background: "#10B981",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#10B981",
              },
            },
            error: {
              style: {
                background: "#EF4444",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#EF4444",
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
