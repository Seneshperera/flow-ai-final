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
        baseTheme: dark,
        variables: {
          colorPrimary: "oklch(0.7 0.15 200)", // Match neon cyan
          colorBackground: "rgba(10,10,10,0.8)",
          colorInputBackground: "rgba(255,255,255,0.05)",
          colorInputText: "#fff",
        },
        elements: {
          card: "glass-panel border border-white/10 shadow-[0_0_40px_rgba(0,255,255,0.05)]",
          headerTitle: "text-white glow-text",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton: "glass-panel border-white/10 text-white hover:bg-white/5",
          formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 glow-border",
          formFieldInput: "bg-white/5 border-white/10 text-white focus:border-primary/50 transition-colors rounded-xl",
          formFieldLabel: "text-muted-foreground font-medium",
          dividerLine: "bg-white/10",
          dividerText: "text-muted-foreground",
          footerActionLink: "text-primary hover:underline",
        }
      }}
    >
      <html
        lang="en"
        className={`dark ${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <body className="min-h-screen flex flex-col relative overflow-x-hidden selection:bg-primary/30">
          <QueryProvider>
            {/* Background ambient glow */}
            <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
            {children}
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
