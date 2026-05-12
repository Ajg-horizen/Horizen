"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import CasesSectionBento from "@/components/CasesSectionBento";
import GlassBlogSection from "@/components/GlassBlogSection";
import TrustpilotSection from "@/components/TrustpilotSection";
import BentoShowcase from "@/components/BentoShowcase";
import Container from "@/components/Container";
import { LogoMarquee } from "@/components/ui/logo-marquee";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";

import Footer from "@/components/Footer";

const clientLogos = [
  { src: "/logo/Horizen_Branding_Novo_Nordisk.svg", alt: "Novo Nordisk" },
  { src: "/logo/Horizen_Branding_ArenaRanders.svg", alt: "Arena Randers" },
  { src: "/logo/Logo-NeverAnother-White-RGB.svg", alt: "Never Another" },
  { src: "/logo/Horizen_Branding_Nordic.svg", alt: "Nordic" },
  { src: "/logo/Horizen_Branding_Jesper_Lundgaard-08.svg", alt: "Jesper Lundgaard" },
  { src: "/logo/Horizen_Branding_Komunikado.svg", alt: "Komunikado" },
  { src: "/logo/Horizen_Branding_AAEL.svg", alt: "AAEL" },
  { src: "/logo/BettrPlans-logo-01.svg", alt: "BettrPlans" },
  { src: "/Bomærker/TUG-Bomærke-hvid.svg", alt: "Tandsundhed Uden Grænser" },
  { src: "/Bomærker/Co-Craft-bomærke.svg", alt: "Co Craft" },
];


// Lazy load heavy components (Matter.js ~90KB, tsparticles ~40KB)
const FloatingContact = dynamic(() => import("@/components/FloatingContact"), { ssr: false });
const PhysicsPlayground = dynamic(() => import("@/components/PhysicsPlayground"), { ssr: false });

export default function HomeClient() {
  return (
    <main id="main" tabIndex={-1}>
      <Navbar />
      <FloatingContact />

      <Hero />

      <div className="relative z-10 bg-background rounded-t-[2rem] -mt-8 shadow-[0_-20px_60px_rgba(0,0,0,0.04),0_20px_60px_rgba(0,0,0,0.06)]">
          <CasesSectionBento />

          <Container as="section" size="site" className="pt-4 pb-16">
            <ScrambleEyebrow>Vores team har arbejdet med</ScrambleEyebrow>
            <div className="mt-8">
              <LogoMarquee logos={clientLogos} />
            </div>
          </Container>
          <PhysicsPlayground />
          <ServicesSection />
          <BentoShowcase />
          <TrustpilotSection />

          <GlassBlogSection />

          <Footer />
      </div>
    </main>
  );
}
