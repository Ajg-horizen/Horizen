"use client";

import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import Container from "@/components/Container";

const heartGrid = [
  [0,1,1,0,0,1,1,0],
  [1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,0,0],
  [0,0,0,1,1,0,0,0],
];

function PixelHeart() {
  return (
    <div className="relative grid grid-cols-8 gap-[1.5px]">
      {heartGrid.flat().map((on, i) => (
        <div
          key={i}
          className={`h-[2px] w-[2px] rounded-[0.5px] transition-colors ${
            on ? "bg-emerald-400/80" : "bg-transparent"
          }`}
        />
      ))}
    </div>
  );
}

type FooterLink = { name: string; href: string; disabled?: boolean };

const navigation: Record<string, FooterLink[]> = {
  services: [
    { name: "Webudvikling", href: "/services/webudvikling" },
    { name: "UI/UX Design", href: "/services/ui-ux-design" },
    { name: "Branding", href: "/services/branding" },
    { name: "WordPress", href: "/services/wordpress", disabled: true },
  ],
  marketing: [
    { name: "SEO", href: "/marketing/seo", disabled: true },
    { name: "GEO", href: "/marketing/ai-search-optimization", disabled: true },
    { name: "Google Ads", href: "/marketing/google-ads", disabled: true },
    { name: "Social Media", href: "/marketing/social-media", disabled: true },
    { name: "AI Search", href: "/marketing/ai-search-optimization", disabled: true },
  ],
  virksomhed: [
    { name: "Cases", href: "/cases", disabled: true },
    { name: "Blog", href: "/blog" },
    { name: "Kontakt", href: "/kontakt" },
  ],
};

const socials: FooterLink[] = [
  { name: "LinkedIn", href: "https://linkedin.com", disabled: true },
  { name: "Instagram", href: "https://instagram.com", disabled: true },
  { name: "Facebook", href: "https://facebook.com", disabled: true },
];

export default function Footer() {
  return (
    <Container size="site" noPadding className="px-4 pb-4 md:px-6 md:pb-6 lg:px-8">
      <footer className="rounded-2xl bg-gradient-to-b from-[#1e1e1e] via-foreground to-[#080808] text-background border border-white/[0.10] md:rounded-3xl">
        <div className="px-6 pt-24 pb-10 md:px-10 lg:px-16">
          {/* Top section */}
          <div className="grid gap-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-8">
            {/* Brand column */}
            <div>
              <img
                src="/logo/Horizen-LogoType-Black.svg"
                alt="Horizen"
                className="h-6 w-auto invert"
              />
              <p className="mt-6 max-w-xs text-sm leading-relaxed text-background/50">
                Digital design bureau med 8+ års erfaring. Hjemmesider,
                branding og UI/UX. Drevet af erfaring. Forstærket af AI.
              </p>
              <div className="mt-8 space-y-2">
                <a
                  href="mailto:ajg@horizen.dk"
                  className="block text-sm text-background/50 transition-colors duration-300 hover:text-background"
                >
                  ajg@horizen.dk
                </a>
                <a
                  href="tel:+4528127652"
                  className="block text-sm text-background/50 transition-colors duration-300 hover:text-background"
                >
                  +45 28 12 76 52
                </a>
                <p className="block text-sm text-background/50">
                  Aarhus, Danmark
                </p>
              </div>
            </div>

            {/* Web & Design */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-background/30">
                Web & Design
              </h4>
              <ul className="mt-5 space-y-3">
                {navigation.services.map((item) => (
                  <li key={item.name}>
                    {item.disabled ? (
                      <span
                        aria-disabled="true"
                        className="cursor-not-allowed text-sm text-background/30 select-none"
                      >
                        {item.name}
                      </span>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-sm text-background/50 transition-colors duration-300 hover:text-background"
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Marketing */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-background/30">
                Marketing
              </h4>
              <ul className="mt-5 space-y-3">
                {navigation.marketing.map((item) => (
                  <li key={item.name}>
                    {item.disabled ? (
                      <span
                        aria-disabled="true"
                        className="cursor-not-allowed text-sm text-background/30 select-none"
                      >
                        {item.name}
                      </span>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-sm text-background/50 transition-colors duration-300 hover:text-background"
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Virksomhed */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-background/30">
                Virksomhed
              </h4>
              <ul className="mt-5 space-y-3">
                {navigation.virksomhed.map((item) => (
                  <li key={item.name}>
                    {item.disabled ? (
                      <span
                        aria-disabled="true"
                        className="cursor-not-allowed text-sm text-background/30 select-none"
                      >
                        {item.name}
                      </span>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-sm text-background/50 transition-colors duration-300 hover:text-background"
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-20 border-t border-background/[0.08]" />

          {/* Bottom */}
          <div className="mt-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <p className="text-xs text-background/30">
              &copy; {new Date().getFullYear()} Horizen. Alle rettigheder
              forbeholdes.
            </p>

            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-emerald-500/20 blur-lg" />
                <PixelHeart />
              </div>
              <span className="text-xs text-background/30">
                With great guidance, come great results · <span className="text-background/50 font-medium">Horizen</span>
              </span>
            </div>

            <div className="flex items-center gap-5">
              {socials.map((social) => (
                social.disabled ? (
                  <span
                    key={social.name}
                    aria-disabled="true"
                    className="flex items-center gap-1 text-xs text-background/20 cursor-not-allowed select-none"
                  >
                    {social.name}
                  </span>
                ) : (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1 text-xs text-background/30 transition-colors duration-300 hover:text-background"
                  >
                    {social.name}
                    <ArrowUpRightIcon className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                )
              ))}
            </div>
          </div>
        </div>
      </footer>
    </Container>
  );
}
