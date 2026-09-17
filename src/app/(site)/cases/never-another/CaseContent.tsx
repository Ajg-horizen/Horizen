"use client";

import { motion } from "framer-motion";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fadeUp } from "@/lib/animations";

export default function CaseContent() {
  return (
    <main>
      <Navbar alwaysVisible />

      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-28 text-center">
        <motion.div
          custom={0.3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <p className="text-xs font-medium tracking-[0.3em] text-muted uppercase">
            Kommer snart
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Never Another
          </h1>
          <p className="mt-4 max-w-md text-muted leading-relaxed">
            Vi arbejder på denne case study. Kom tilbage snart for at se
            det fulde overblik over projektet.
          </p>
          <Link
            href="/#cases"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4" />
            Tilbage til cases
          </Link>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
