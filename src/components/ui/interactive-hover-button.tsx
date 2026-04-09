'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface InteractiveHoverButtonProps {
  text?: string
  href?: string
  classes?: string
}

export default function InteractiveHoverButton({
  text = 'Button',
  href = '#',
  classes,
}: InteractiveHoverButtonProps) {
  return (
    <motion.a
      href={href}
      className={cn(
        'group relative flex min-w-40 items-center justify-center overflow-hidden rounded-full border border-foreground bg-background p-2 px-6 font-semibold',
        classes
      )}
      layout
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-emerald-500 transition-all duration-500 group-hover:scale-[40] group-hover:bg-foreground" />
        <span className="inline-block text-sm transition-all duration-500 group-hover:translate-x-20 group-hover:opacity-0">
          {text}
        </span>
        <div className="absolute top-0 left-0 z-10 flex h-full w-full -translate-x-16 items-center justify-center gap-2 text-background opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
          <span className="text-sm">{text}</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </motion.a>
  )
}
