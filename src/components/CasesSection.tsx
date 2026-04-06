"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";


const cases = [
  {
    title: "Seitz",
    client: "Seitz",
    category: "Webdesign · Branding",
    image: "/cases/Case-image.webp",
    href: "/cases/malerfirma-seitz",
    team: [
      { name: "José", avatar: "/staff/staff-José-digital-design.jpg" },
      { name: "Ludvig", avatar: "/staff/staff-kommunikation-og-salg-Ludvig.webp" },
    ],
  },
  {
    title: "OD Pro",
    client: "OD Pro",
    category: "Webdesign · Udvikling",
    image: "/cases/OD-Cases-image-car.webp",
    href: "/cases/od-biler-pro",
    team: [
      { name: "Johanne", avatar: "/staff/staff-Web-udvikler-designer-Johanne-horizen.avif" },
      { name: "José", avatar: "/staff/staff-José-digital-design.jpg" },
    ],
  },
  {
    title: "Tandsundhed Uden Grænser",
    client: "TUDG",
    category: "Webdesign · NGO",
    image: "/cases/Tand-sundhed-hero-image.webp",
    href: "/cases/tandsundhed-uden-graenser",
    team: [
      { name: "Johanne", avatar: "/staff/staff-Web-udvikler-designer-Johanne-horizen.avif" },
      { name: "Anne-Sofie", avatar: "/staff/staff-Marketing-ansvarlig-Anne-Sofie.webp" },
    ],
  },
  {
    title: "Never Another",
    client: "Never Another",
    category: "Branding · Webdesign",
    image: "/cases/NA_Home5_mobile.webp",
    href: "/cases/never-another",
    team: [
      { name: "José", avatar: "/staff/staff-José-digital-design.jpg" },
      { name: "Sebastian", avatar: "/staff/staff-.Sebastian-Meta-facebook.jpg" },
    ],
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: [0.215, 0.61, 0.355, 1] as const,
    },
  }),
};

export default function CasesSection() {
  return (
    <section className="px-6 py-32 md:px-10 lg:px-16" id="cases">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <ScrambleEyebrow>Udvalgte projekter</ScrambleEyebrow>
          <div className="mt-4 flex items-end justify-between">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Cases
            </h2>
            <a
              href="/cases"
              className="group flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-300 hover:text-foreground"
            >
              Se alle cases
              <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {cases.map((item, i) => (
            <motion.a
              key={item.href}
              href={item.href}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className="group flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-accent">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>

              {/* Info */}
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{item.category}</p>
                </div>

                {/* Team avatars */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">by</span>
                  <div className="flex -space-x-2">
                    {item.team.map((member) => (
                      <img
                        key={member.name}
                        src={member.avatar}
                        alt={member.name}
                        title={member.name}
                        loading="lazy"
                        className="h-7 w-7 rounded-full border-2 border-background object-cover"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
