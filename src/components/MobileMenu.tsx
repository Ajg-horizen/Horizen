"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";
import { navCategories, type NavItem } from "@/lib/nav-data";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { duration: 0.4, ease: [0.215, 0.61, 0.355, 1] as const },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.3, ease: [0.55, 0, 1, 0.45] as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  const toggleSection = (label: string) => {
    setOpenSection((prev) => (prev === label ? null : label));
  };

  const handleLinkClick = () => {
    setOpenSection(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] lg:hidden"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            variants={overlayVariants}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="absolute inset-y-0 right-0 w-full max-w-md bg-background shadow-2xl shadow-black/10 flex flex-col h-dvh"
            variants={panelVariants}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-foreground/[0.06]">
              <a href="/" onClick={handleLinkClick}>
                <img
                  src="/logo/Horizen-LogoType-Black.svg"
                  alt="Horizen"
                  className="h-5 w-auto"
                />
              </a>
              <button
                onClick={onClose}
                className="relative w-6 h-6 flex items-center justify-center"
                aria-label="Luk menu"
              >
                <motion.span
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 45 }}
                  className="absolute block h-[1.5px] w-5 bg-foreground"
                />
                <motion.span
                  initial={{ rotate: 0 }}
                  animate={{ rotate: -45 }}
                  className="absolute block h-[1.5px] w-5 bg-foreground"
                />
              </button>
            </div>

            {/* Nav content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <nav className="space-y-1">
                {navCategories.map((category) => (
                  <div key={category.label}>
                    {/* Category header */}
                    <button
                      onClick={() => toggleSection(category.label)}
                      className="flex w-full items-center justify-between py-4 text-left"
                    >
                      <span className="text-lg font-semibold tracking-tight">
                        {category.label}
                      </span>
                      <motion.span
                        animate={{
                          rotate: openSection === category.label ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDownIcon className="size-5 text-muted" />
                      </motion.span>
                    </button>

                    {/* Sub-items */}
                    <AnimatePresence>
                      {openSection === category.label && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={staggerContainer}
                          className="pb-3 pl-1"
                        >
                          {category.items.map((item: NavItem) => (
                            <motion.div key={item.href} variants={itemVariants}>
                              <Link
                                href={item.href}
                                onClick={handleLinkClick}
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-foreground/[0.03]"
                              >
                                <item.icon className="size-4 shrink-0 text-muted" />
                                <span className="text-sm font-medium">
                                  {item.title}
                                </span>
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {/* Direct links */}
                <div className="border-t border-foreground/[0.06] pt-2">
                  <Link
                    href="/om-os"
                    onClick={handleLinkClick}
                    className="flex items-center py-4 text-lg font-semibold tracking-tight"
                  >
                    Om os
                  </Link>
                </div>
              </nav>
            </div>

            {/* Bottom CTA */}
            <div className="px-6 py-6 border-t border-foreground/[0.06]">
              <a
                href="#contact"
                onClick={handleLinkClick}
                className="flex items-center justify-center w-full rounded-full bg-foreground px-8 py-3.5 text-sm font-semibold text-background transition-colors duration-300 hover:bg-foreground/90"
              >
                Kontakt os
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
