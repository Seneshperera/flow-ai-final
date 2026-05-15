import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import QueryProvider from "@/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "FlowPilot AI - The AI Business Operating System",
  description: "A futuristic AI-powered business operating system for modern enterprises.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined, // Let theme provider handle it or use dynamic logic
        variables: {
          colorPrimary: "#00e5ff",
          borderRadius: "1rem",
        },
      }}
    >
      <html
        lang="en"
        suppressHydrationWarning
      >
        <body 
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              {children}
            </QueryProvider>
            <Toaster position="top-right" richColors theme="dark" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
