import { cn } from "@/lib/utils";

type ContainerSize = "site" | "article" | "narrow";

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  size?: ContainerSize;
  children: React.ReactNode;
  noPadding?: boolean;
}

const maxWidthMap: Record<ContainerSize, string> = {
  site: "max-w-[2500px]",
  article: "max-w-6xl",
  narrow: "max-w-3xl",
};

export default function Container({
  as: Tag = "div",
  size = "site",
  className,
  children,
  noPadding = false,
  ...rest
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto",
        maxWidthMap[size],
        !noPadding && "px-6 sm:px-8 md:px-10 lg:px-16",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
