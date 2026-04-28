import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
  logos: Logo[];
};

/**
 * Grid-baseret logo-cloud med plus-ikoner i hjørnerne (4 col desktop / 2 col mobil).
 */
export function LogoCloud({ logos, className, ...props }: LogoCloudProps) {
  return (
    <div
      className={cn(
        "relative grid grid-cols-2 border-x border-foreground/[0.05] md:grid-cols-4",
        className
      )}
      {...props}
    >
      <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-screen border-t border-foreground/[0.05]" />

      {logos.map((logo, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const isLastRow = row === Math.floor((logos.length - 1) / 4);
        return (
          <LogoCard
            key={logo.src}
            logo={logo}
            className={cn(
              "border-foreground/[0.05]",
              col < 3 && "border-r",
              !isLastRow && "border-b",
              (i + row) % 2 === 0 && "bg-foreground/[0.025]"
            )}
          >
            {col < 3 && !isLastRow && (
              <PlusIcon
                className="-right-[12.5px] -bottom-[12.5px] absolute z-10 size-6 text-foreground/15"
                strokeWidth={1}
              />
            )}
          </LogoCard>
        );
      })}

      <div className="-translate-x-1/2 -bottom-px pointer-events-none absolute left-1/2 w-screen border-b border-foreground/[0.05]" />
    </div>
  );
}

type LogoCardProps = React.ComponentProps<"div"> & {
  logo: Logo;
};

function LogoCard({ logo, className, children, ...props }: LogoCardProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center px-4 py-8 md:p-10",
        className
      )}
      {...props}
    >
      <img
        alt={logo.alt}
        className="pointer-events-none h-6 select-none object-contain invert opacity-40 grayscale transition-opacity duration-300 hover:opacity-70 md:h-8"
        height={logo.height || "auto"}
        src={logo.src}
        width={logo.width || "auto"}
      />
      {children}
    </div>
  );
}
