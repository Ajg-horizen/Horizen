import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BookOpen, Clock } from "lucide-react";
import Link from "next/link";

interface GlassBlogCardProps {
  title?: string;
  excerpt?: string;
  image?: string;
  author?: {
    name: string;
    avatar: string;
  };
  date?: string;
  readTime?: string;
  tags?: string[];
  href?: string;
  className?: string;
}

const defaultPost = {
  title: "The Future of UI Design",
  excerpt:
    "Exploring the latest trends in glassmorphism, 3D elements, and micro-interactions.",
  image:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
  author: {
    name: "Moumen Soliman",
    avatar: "https://github.com/shadcn.png",
  },
  date: "Dec 2, 2025",
  readTime: "5 min read",
  tags: ["Design", "UI/UX"],
};

function CardInner({
  title,
  excerpt,
  image,
  author,
  date,
  readTime,
  tags,
}: {
  title: string;
  excerpt: string;
  image: string;
  author: { name: string; avatar: string };
  date: string;
  readTime: string;
  tags: string[];
}) {
  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-none bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="relative aspect-[16/9] overflow-hidden">
        <motion.img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/80 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

        <div className="absolute bottom-3 left-3 flex gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-[#f5f5f0]/50 text-foreground backdrop-blur-sm hover:bg-[#f5f5f0]/80"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-[#0f0f0f]/20 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background shadow-lg shadow-foreground/25"
          >
            <BookOpen className="h-4 w-4" />
            Læs artikel
          </motion.span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold leading-tight tracking-tight text-foreground transition-colors group-hover:text-foreground/70">
            {title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {excerpt}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-border/50">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-xs">
              <span className="font-medium text-foreground">
                {author.name}
              </span>
              <span className="text-muted-foreground">{date}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{readTime}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function GlassBlogCard({
  title = defaultPost.title,
  excerpt = defaultPost.excerpt,
  image = defaultPost.image,
  author = defaultPost.author,
  date = defaultPost.date,
  readTime = defaultPost.readTime,
  tags = defaultPost.tags,
  href,
  className,
}: GlassBlogCardProps) {
  const cardProps = { title, excerpt, image, author, date, readTime, tags };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("w-full max-w-[400px]", className)}
    >
      {href ? (
        <Link href={href} className="block h-full">
          <CardInner {...cardProps} />
        </Link>
      ) : (
        <CardInner {...cardProps} />
      )}
    </motion.div>
  );
}
