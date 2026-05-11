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
          colorPrimary: "#00e5ff", // Neon cyan
          colorBackground: "#09090b", // Deep dark zinc
          colorInputBackground: "#18181b", 
          colorInputText: "#ffffff", 
          colorText: "#ffffff", 
          colorTextSecondary: "#a1a1aa", 
          borderRadius: "1rem",
        },
        elements: {
          card: "border border-white/10 shadow-[0_0_40px_rgba(0,229,255,0.1)] bg-black/80 backdrop-blur-2xl p-8",
          headerTitle: "text-2xl font-bold text-white tracking-tight",
          headerSubtitle: "text-zinc-400",
          formButtonPrimary: "bg-[#00e5ff] text-black hover:bg-[#33ebff] font-bold shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all",
          formFieldInput: "bg-zinc-900 border-zinc-800 text-white focus:border-[#00e5ff] transition-colors rounded-xl",
          formFieldLabel: "text-zinc-300 font-medium",
          footerActionLink: "text-[#00e5ff] hover:text-[#33ebff] hover:underline transition-colors",
        }
      }}
    >
      <html
        lang="en"
        suppressHydrationWarning
        className={`dark ${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <body 
          suppressHydrationWarning 
          className="min-h-screen flex flex-col relative overflow-x-hidden selection:bg-primary/30"
        >
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
