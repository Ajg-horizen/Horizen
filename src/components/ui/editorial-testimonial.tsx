"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow"

const testimonials = [
  {
    id: 1,
    quote: "Horizen forstod vores vision fra dag ét og leverede et resultat der overgik alle forventninger.",
    author: "Mikkel Andersen",
    role: "CEO",
    company: "Nordic Digital",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    quote: "De kombinerer ægte håndværk med teknologisk forståelse. Det er sjældent man finder begge dele.",
    author: "Line Kjærgaard",
    role: "Marketing Director",
    company: "Sustainify",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    quote: "Vores konverteringsrate steg med 340% efter relanceringen. Tallene taler for sig selv.",
    author: "Thomas Brandt",
    role: "Founder",
    company: "Brandt & Co",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    quote: "Et bureau der faktisk lytter, forstår og eksekverer. Vi har endelig fundet vores faste partner.",
    author: "Sofie Holm",
    role: "Brand Manager",
    company: "Aura Studio",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=80",
  },
]

export default function TestimonialsEditorial() {
  const [active, setActive] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleChange = (index: number) => {
    if (index === active || isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActive(index)
      setTimeout(() => setIsTransitioning(false), 50)
    }, 300)
  }

  const handlePrev = () => {
    const newIndex = active === 0 ? testimonials.length - 1 : active - 1
    handleChange(newIndex)
  }

  const handleNext = () => {
    const newIndex = active === testimonials.length - 1 ? 0 : active + 1
    handleChange(newIndex)
  }

  const current = testimonials[active]

  return (
    <section className="px-6 py-32 md:px-10 lg:px-16">
      <div>
        <div className="mb-10">
          <ScrambleEyebrow>Hvad vores kunder siger</ScrambleEyebrow>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="flex items-start gap-8">
            <span
              className="text-[120px] font-light leading-none text-foreground/[0.06] select-none transition-all duration-500 hidden sm:block"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              {String(active + 1).padStart(2, "0")}
            </span>

            <div className="flex-1 pt-4 sm:pt-6">
              <blockquote
                className={`text-2xl md:text-3xl font-light leading-relaxed text-foreground tracking-tight transition-all duration-300 ${
                  isTransitioning ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
                }`}
              >
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              <div
                className={`mt-10 group cursor-default transition-all duration-300 delay-100 ${
                  isTransitioning ? "opacity-0" : "opacity-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-foreground/[0.06] group-hover:ring-foreground/20 transition-all duration-300">
                    <Image
                      src={current.image}
                      alt={current.author}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{current.author}</p>
                    <p className="text-sm text-muted">
                      {current.role}
                      <span className="mx-2 text-foreground/10">/</span>
                      <span className="group-hover:text-foreground transition-colors duration-300">{current.company}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                {testimonials.map((_, index) => (
                  <button key={index} onClick={() => handleChange(index)} className="group relative py-4">
                    <span
                      className={`block h-px transition-all duration-500 ease-out ${
                        index === active
                          ? "w-12 bg-foreground"
                          : "w-6 bg-foreground/[0.12] group-hover:w-8 group-hover:bg-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs text-muted tracking-widest uppercase">
                {String(active + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full text-muted hover:text-foreground hover:bg-foreground/[0.04] transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full text-muted hover:text-foreground hover:bg-foreground/[0.04] transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
