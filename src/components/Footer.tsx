"use client";

import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

const navigation = {
  services: [
    { name: "Webdesign", href: "/services/webdesign" },
    { name: "UI/UX Design", href: "/services/ui-ux-design" },
    { name: "Branding", href: "/services/branding" },
    { name: "Udvikling", href: "/services/udvikling" },
  ],
  marketing: [
    { name: "SEO", href: "/marketing/seo" },
    { name: "GEO", href: "/marketing/ai-search-optimization" },
    { name: "Google Ads", href: "/marketing/google-ads" },
    { name: "Social Media", href: "/marketing/social-media" },
    { name: "AI Search", href: "/marketing/ai-search-optimization" },
  ],
  virksomhed: [
    { name: "Cases", href: "/cases" },
    { name: "Om os", href: "/om-os" },
    { name: "Blog", href: "/blog" },
    { name: "Kontakt", href: "#contact" },
  ],
};

const socials = [
  { name: "LinkedIn", href: "https://linkedin.com" },
  { name: "Instagram", href: "https://instagram.com" },
  { name: "Facebook", href: "https://facebook.com" },
];

export default function Footer() {
  return (
    <div className="px-4 pb-4 md:px-6 md:pb-6 lg:px-8">
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
                Vi skaber digitale oplevelser der konverterer. Drevet af
                erfaring. Forstærket af AI.
              </p>
              <div className="mt-8 space-y-2">
                <a
                  href="mailto:hej@horizen.dk"
                  className="block text-sm text-background/50 transition-colors duration-300 hover:text-background"
                >
                  hej@horizen.dk
                </a>
                <a
                  href="tel:+4528127652"
                  className="block text-sm text-background/50 transition-colors duration-300 hover:text-background"
                >
                  +45 28 12 76 52
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-background/30">
                Services
              </h4>
              <ul className="mt-5 space-y-3">
                {navigation.services.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-background/50 transition-colors duration-300 hover:text-background"
                    >
                      {item.name}
                    </Link>
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
                    <Link
                      href={item.href}
                      className="text-sm text-background/50 transition-colors duration-300 hover:text-background"
                    >
                      {item.name}
                    </Link>
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
                    <Link
                      href={item.href}
                      className="text-sm text-background/50 transition-colors duration-300 hover:text-background"
                    >
                      {item.name}
                    </Link>
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

            <div className="flex items-center gap-5">
              {socials.map((social) => (
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
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
