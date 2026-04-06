"use client";

import dynamic from "next/dynamic";

const GlassCursor = dynamic(() => import("@/components/GlassCursor"), { ssr: false });

export default function GlobalCursor() {
  return <GlassCursor />;
}
