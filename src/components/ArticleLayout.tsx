"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicIslandTOC from "@/components/DynamicIslandTOC";
import { fadeInUp } from "@/lib/animations";
import { LinkIcon, CheckIcon } from "lucide-react";
import Container from "@/components/Container";

interface ArticleProps {
  title: string;
  excerpt: string;
  image: string;
  author: {
    name: string;
    title?: string;
    role: string;
    avatar: string;
    bio?: string;
  };
  date: string;
  readTime: string;
  tags: string[];
  content: React.ReactNode;
  relatedArticles?: {
    title: string;
    href: string;
    image: string;
    tag: string;
  }[];
}

const iconClass = "flex h-9 w-9 items-center justify-center rounded-full border border-foreground/[0.08] text-foreground/30 transition-colors hover:border-foreground/20 hover:text-foreground/60";

function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const openShare = (platform: string) => {
    const u = encodeURIComponent(window.location.href);
    const t = encodeURIComponent(title);
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      telegram: `https://t.me/share/url?url=${u}&text=${t}`,
    };
    window.open(urls[platform], "_blank", "noopener,noreferrer");
  };

  return (
    <div className="text-center">
      <p className="text-xs font-medium text-muted">Del denne artikel</p>
      <div className="mt-3 flex justify-center gap-2">
        <button onClick={() => openShare("twitter")} className={iconClass}>
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </button>
        <button onClick={() => openShare("linkedin")} className={iconClass}>
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </button>
        <button onClick={() => openShare("facebook")} className={iconClass}>
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </button>
        <button onClick={() => openShare("telegram")} className={iconClass}>
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M.001 0v24h24V0H.001zM19.938 7.2l-2.57 12.11c-.19.86-.7 1.07-1.42.67l-3.92-2.89-1.89 1.82c-.21.21-.39.39-.79.39l.28-3.97 7.22-6.52c.31-.28-.07-.43-.49-.16l-8.93 5.62-3.84-1.2c-.84-.26-.85-.84.17-1.24l15.02-5.79c.7-.26 1.31.17 1.08 1.24l.01-.01z"/></svg>
        </button>
      </div>
      {/* Copy link button */}
      <button
        onClick={handleCopy}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground/60"
      >
        {copied ? (
          <>
            <CheckIcon className="h-3 w-3 text-emerald-500" />
            <span className="text-emerald-500">Kopieret!</span>
          </>
        ) : (
          <>
            <LinkIcon className="h-3 w-3" />
            <span>Kopier artikellink</span>
          </>
        )}
      </button>
    </div>
  );
}

export default function ArticleLayout({
  title,
  image,
  author,
  date,
  readTime,
  tags,
  content,
  relatedArticles,
}: ArticleProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-background text-foreground">
      <Navbar alwaysVisible />
      <DynamicIslandTOC />

      <Container size="article" className="pt-32 pb-24">
          {/* Two-column grid */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">

            {/* Main content column */}
            <div className="min-w-0">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Author inline (mobile) + Category | Date */}
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-2 lg:hidden">
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-medium">{author.name}</span>
                    <span className="text-foreground/15">·</span>
                  </div>
                  <span className="font-medium text-foreground/80">
                    {tags.join(" · ")}
                  </span>
                  <span className="text-foreground/20">|</span>
                  <span className="text-muted">{date}</span>
                </div>

                {/* Title */}
                <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
                  {title}
                </h1>
              </motion.div>

              {/* Cover image — inline, not hero */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mt-10"
              >
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={image}
                    alt={title}
                    className="w-full object-cover aspect-[16/9]"
                  />
                </div>
              </motion.div>

              {/* Article body */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-12"
              >
                {content}
              </motion.article>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                {/* Author card — subtle, light */}
                <div className="text-center">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="mx-auto h-14 w-14 rounded-full object-cover"
                  />
                  <h3 className="mt-3 text-sm font-semibold">{author.name}</h3>
                  {author.title && (
                    <p className="mt-0.5 text-xs font-medium text-foreground/60">
                      {author.title}
                    </p>
                  )}
                  <p className="mt-0.5 text-xs text-muted">
                    {author.role}
                  </p>
                </div>

                {/* Divider */}
                <div className="my-6 h-px bg-foreground/[0.06]" />

                {/* Share */}
                <ShareButtons title={title} />

                {/* Sidebar related — just 2 articles, minimal */}
                {relatedArticles && relatedArticles.length > 0 && (
                  <>
                    <div className="my-6 h-px bg-foreground/[0.06]" />
                    <div className="space-y-4">
                      {relatedArticles.slice(0, 2).map((article) => (
                        <Link
                          key={article.href}
                          href={article.href}
                          className="group block"
                        >
                          <p className="text-xs text-muted">{article.tag}</p>
                          <p className="mt-0.5 text-sm font-medium leading-snug transition-colors group-hover:text-foreground/60">
                            {article.title}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </aside>
          </div>
      </Container>

      {/* spacer for mobile before related articles */}
      <div className="h-8 lg:hidden" />

      {/* Related articles — full width, 3 columns */}
      {relatedArticles && relatedArticles.length > 0 && (
        <Container as="section" size="article" className="py-24 border-t border-foreground/[0.06]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={0}
              variants={fadeInUp}
              className="mb-10"
            >
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Mere fra Horizen
              </h2>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((article, i) => (
                <motion.div
                  key={article.href}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeInUp}
                >
                  <Link href={article.href} className="group block">
                    <div className="overflow-hidden rounded-2xl aspect-[16/9]">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="mt-4">
                      <span className="text-xs font-medium text-muted">{article.tag}</span>
                      <h3 className="mt-1 text-lg font-semibold tracking-tight">
                        {article.title}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
        </Container>
      )}

      <Footer />
    </main>
  );
}
