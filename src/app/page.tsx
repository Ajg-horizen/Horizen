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
import { LogoCloud } from "@/components/ui/logo-cloud-2";
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
];


// Lazy load heavy components (Matter.js ~90KB, tsparticles ~40KB)
const FloatingContact = dynamic(() => import("@/components/FloatingContact"), { ssr: false });
const PhysicsPlayground = dynamic(() => import("@/components/PhysicsPlayground"), { ssr: false });

export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <Navbar />
      <FloatingContact />

      <Hero />

      <div className="relative z-10 bg-background rounded-t-[2rem] -mt-8 shadow-[0_-20px_60px_rgba(0,0,0,0.04),0_20px_60px_rgba(0,0,0,0.06)]">
          <Container as="section" size="site" className="pt-20 pb-6">
            <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted">
              Vores team har arbejdet med
            </p>
            <LogoMarquee logos={clientLogos} />
          </Container>

          <CasesSectionBento />
          <PhysicsPlayground />
          <ServicesSection />
          <BentoShowcase />
          <TrustpilotSection />

          <Container as="section" size="site" className="py-24">
            <div className="mb-10">
              <ScrambleEyebrow>Social proof</ScrambleEyebrow>
              <h3 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
                Virksomheder der stoler på os
              </h3>
            </div>
            <LogoCloud logos={clientLogos} />
          </Container>

          <GlassBlogSection />

          <Footer />
      </div>
    </main>
  );
}
