"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ContactButton } from "@/components/ContactButton";
import MobileMenu from "@/components/MobileMenu";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { services, marketing, ai, resources } from "@/lib/nav-data";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

function ListItem({
  title,
  children,
  href,
  icon: Icon,
  badge,
}: {
  title: string;
  children: React.ReactNode;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}) {
  const content = (
    <>
      <Icon className="size-4 shrink-0 text-muted" />
      <div>
        <div className="text-sm font-medium leading-none">{title}</div>
        {badge ? (
          <span className="mt-1.5 inline-flex items-center rounded-full border border-foreground/15 px-2 py-0.5 text-[10px] font-medium text-muted">
            {badge}
          </span>
        ) : (
          <p className="mt-1 text-xs text-muted line-clamp-1">{children}</p>
        )}
      </div>
    </>
  );

  return (
    <li>
      {badge ? (
        <div className="flex flex-row items-center gap-3 rounded-md p-3 cursor-not-allowed opacity-60 select-none" aria-disabled="true">
          {content}
        </div>
      ) : (
        <NavigationMenuLink asChild>
          <Link href={href} className="flex-row items-center gap-3">
            {content}
          </Link>
        </NavigationMenuLink>
      )}
    </li>
  );
}

export default function Navbar({ alwaysVisible = false }: { alwaysVisible?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: [0.215, 0.61, 0.355, 1],
        }}
        data-scrolled={scrolled || alwaysVisible ? "true" : undefined}
        className={`fixed top-0 left-0 right-0 z-50 mx-auto max-w-[2500px] transition-all duration-500 ease-out ${
          scrolled || alwaysVisible
            ? "px-4 py-3 md:px-6 lg:px-8"
            : "px-6 py-5 md:px-10 lg:px-16"
        }`}
      >
        <div
          className={`flex items-center justify-between rounded-2xl border transition-all duration-500 ease-out ${
            scrolled || alwaysVisible
              ? "border-foreground/[0.08] bg-background/70 backdrop-blur-xl shadow-xl shadow-black/[0.06] px-6 py-3"
              : "border-transparent bg-transparent px-0 py-0"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="block shrink-0">
            <img
              src="/logo/Horizen-LogoType-Black.svg"
              alt="Horizen"
              className="h-5 w-auto md:h-6"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Web & Design</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[420px] gap-1 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {services.map((item) => (
                        <ListItem
                          key={item.href}
                          title={item.title}
                          href={item.href}
                          icon={item.icon}
                          badge={item.badge}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Marketing</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[420px] gap-1 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {marketing.map((item) => (
                        <ListItem
                          key={item.href}
                          title={item.title}
                          href={item.href}
                          icon={item.icon}
                          badge={item.badge}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>AI</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[260px] gap-1">
                      {ai.map((item) => (
                        <ListItem
                          key={item.href}
                          title={item.title}
                          href={item.href}
                          icon={item.icon}
                          badge={item.badge}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Ressourcer</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[420px] gap-1 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {resources.map((item) => (
                        <ListItem
                          key={item.href}
                          title={item.title}
                          href={item.href}
                          icon={item.icon}
                          badge={item.badge}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <span
                    className={`${navigationMenuTriggerStyle()} cursor-not-allowed opacity-50 select-none`}
                    aria-disabled="true"
                  >
                    Om os
                  </span>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop: ContactButton / Mobile: Burger */}
          <div className="shrink-0">
            <div className="hidden lg:block min-w-[130px]">
              <ContactButton />
            </div>
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Luk menu" : "Åbn menu"}
            >
              <MenuToggleIcon
                open={mobileMenuOpen}
                className="size-8 text-foreground"
                strokeWidth={1.8}
                duration={400}
              />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
