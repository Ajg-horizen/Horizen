"use client";

import { useState, type ReactNode } from "react";

type Tab = {
  id: string;
  label: string;
  content: ReactNode;
};

export default function DashboardTabs({
  tabs,
  defaultTab,
}: {
  tabs: Tab[];
  defaultTab?: string;
}) {
  const [active, setActive] = useState(defaultTab ?? tabs[0].id);

  return (
    <>
      <div className="mb-12 flex gap-1 border-b border-foreground/[0.08]">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-foreground"
                  : "text-foreground/50 hover:text-foreground/80"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div>{tabs.find((t) => t.id === active)?.content}</div>
    </>
  );
}
