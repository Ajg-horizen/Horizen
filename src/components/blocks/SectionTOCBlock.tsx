import Container from "@/components/Container";
import type { SectionTOCBlock as SectionTOCBlockData } from "@/lib/services";

export default function SectionTOCBlock({ data }: { data: SectionTOCBlockData }) {
  return (
    <Container as="nav" size="site" aria-label="Sektioner på siden" className="py-8">
      <ul className="flex flex-wrap items-center justify-start gap-2 md:gap-3">
        {data.items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-xs font-medium text-foreground/70 transition-colors duration-300 hover:border-foreground/40 hover:text-foreground md:text-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#00b67a]" />
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </Container>
  );
}
