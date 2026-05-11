import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Solutions from "@/components/Solutions";
import Pricing from "@/components/Pricing";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Solutions />
      <Pricing />
      
      {/* Footer */}
      <footer className="py-8 border-t border-white/10 text-center text-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} FlowPilot AI. Built for the future.</p>
      </footer>
    </main>
  );
}
