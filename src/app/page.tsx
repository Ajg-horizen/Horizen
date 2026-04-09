"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import CasesSection from "@/components/CasesSection";
import GlassBlogSection from "@/components/GlassBlogSection";
import StatsSection from "@/components/StatsSection";
import TrustpilotSection from "@/components/TrustpilotSection";
import BentoShowcase from "@/components/BentoShowcase";

import Footer from "@/components/Footer";


// Lazy load heavy components (Matter.js ~90KB, tsparticles ~40KB)
const FloatingContact = dynamic(() => import("@/components/FloatingContact"), { ssr: false });
const PhysicsPlayground = dynamic(() => import("@/components/PhysicsPlayground"), { ssr: false });
const SocialProof = dynamic(() => import("@/components/SocialProof"), { ssr: false });

export default function Home() {
  return (
    <main>
      <Navbar />
      <FloatingContact />

      <Hero />

      <div className="relative z-10 bg-background rounded-t-[2rem] -mt-8 shadow-[0_-20px_60px_rgba(0,0,0,0.04),0_20px_60px_rgba(0,0,0,0.06)]">
        <CasesSection />
        <StatsSection />
        <PhysicsPlayground />
        <ServicesSection />
        <BentoShowcase />
        <TrustpilotSection />
        <SocialProof />
        <GlassBlogSection />
        <Footer />
      </div>
    </main>
  );
}
