"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { SparklesIcon } from "lucide-react";
import Container from "@/components/Container";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { fadeInUp } from "@/lib/animations";
import type { AiCitationBlock as AiCitationBlockData } from "@/lib/services";

type Phase = "typingQ" | "thinking" | "typingA" | "done";

const Q_SPEED = 45; // ms pr. tegn i spørgsmålet
const A_SPEED = 16; // ms pr. tegn i svaret
const THINK_MS = 1100;
const HOLD_MS = 9000;

/** Credential-badge der bliver et link i ny tab hvis der er en href. */
function CredLink({ href, children }: { href?: string; children: React.ReactNode }) {
  const cls = "flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-2";
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${cls} transition-colors hover:bg-white/[0.12]`}
      >
        {children}
      </a>
    );
  }
  return <div className={cls}>{children}</div>;
}

function AiChatDemo({
  question,
  answerLead,
  answerCitation,
  answerTrail,
  credentials,
}: {
  question: string;
  answerLead: string;
  answerCitation: string;
  answerTrail?: string;
  credentials?: AiCitationBlockData["credentials"];
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });

  const seg1 = `${answerLead} `;
  const seg2 = answerCitation;
  const seg3 = answerTrail ?? "";
  const answerTotal = seg1.length + seg2.length + seg3.length;

  const [phase, setPhase] = useState<Phase>("typingQ");
  const [qLen, setQLen] = useState(0);
  const [aLen, setALen] = useState(0);

  // Start / genstart når blokken kommer i syne.
  useEffect(() => {
    if (!inView) return;
    if (prefersReduced) {
      setQLen(question.length);
      setALen(answerTotal);
      setPhase("done");
      return;
    }
    setQLen(0);
    setALen(0);
    setPhase("typingQ");
  }, [inView, prefersReduced, question, answerTotal]);

  // Tilstandsmaskine (kun når i syne og med bevægelse).
  useEffect(() => {
    if (!inView || prefersReduced) return;
    let t: ReturnType<typeof setTimeout>;

    if (phase === "typingQ") {
      if (qLen < question.length) {
        t = setTimeout(() => setQLen((n) => n + 1), Q_SPEED);
      } else {
        t = setTimeout(() => setPhase("thinking"), 500);
      }
    } else if (phase === "thinking") {
      t = setTimeout(() => setPhase("typingA"), THINK_MS);
    } else if (phase === "typingA") {
      if (aLen < answerTotal) {
        t = setTimeout(() => setALen((n) => n + 1), A_SPEED);
      } else {
        t = setTimeout(() => setPhase("done"), 400);
      }
    } else if (phase === "done") {
      t = setTimeout(() => {
        setQLen(0);
        setALen(0);
        setPhase("typingQ");
      }, HOLD_MS);
    }

    return () => clearTimeout(t);
  }, [phase, qLen, aLen, inView, prefersReduced, question.length, answerTotal]);

  const n1 = Math.min(aLen, seg1.length);
  const n2 = Math.min(Math.max(aLen - seg1.length, 0), seg2.length);
  const n3 = Math.min(Math.max(aLen - seg1.length - seg2.length, 0), seg3.length);
  const showAnswer = phase === "typingA" || phase === "done";
  const caret = <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-[#00b67a] animate-pulse" />;

  return (
    <div ref={ref} className="relative">
      {/* Spørgsmål fra brugeren */}
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-white/[0.08] px-3.5 py-2 text-sm text-white/90">
          {question.slice(0, qLen)}
          {phase === "typingQ" && caret}
        </div>
      </div>

      {/* AI-svar */}
      <div className="mt-4 flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-md bg-white/[0.08]">
          <SparklesIcon className="size-3.5 text-[#00b67a]" />
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
          AI-svar
        </span>
      </div>

      <div className="mt-3 min-h-[3.5rem] text-lg leading-relaxed">
        {phase === "thinking" && (
          <span className="flex items-center gap-1.5 py-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="size-1.5 rounded-full bg-white/40"
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
              />
            ))}
          </span>
        )}
        {showAnswer && (
          <p>
            {seg1.slice(0, n1)}
            {n2 > 0 && (
              <span className="rounded-md bg-[#00b67a]/15 px-1.5 py-0.5 font-semibold text-[#00b67a]">
                {seg2.slice(0, n2)}
              </span>
            )}
            {n3 > 0 && seg3.slice(0, n3)}
            {phase === "typingA" && caret}
          </p>
        )}

        {phase === "done" && credentials && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-4 flex flex-wrap items-center gap-2.5"
          >
            <CredLink href={credentials.trustpilotUrl}>
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#00b67a]">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-sm font-semibold">Trustpilot</span>
              <span className="text-sm text-white/60">
                {credentials.trustpilotScore} / 5
                {credentials.trustpilotReviews ? ` · ${credentials.trustpilotReviews}` : ""}
              </span>
            </CredLink>
            {credentials.bMaerket && (
              <CredLink href={credentials.bMaerketUrl}>
                <img
                  src="/logo/yello-b-badge.svg"
                  alt="Horizen er B-mærket certificeret"
                  className="h-6 w-auto"
                />
                <span className="text-sm text-white/60">B-mærket certificeret</span>
              </CredLink>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function AiCitationBlock({ id, data }: { id?: string; data: AiCitationBlockData }) {
  const heading =
    typeof data.heading === "string" ? { lead: data.heading } : data.heading;

  return (
    <Container as="section" id={id} size="site" className="py-24">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeInUp}
        >
          <ScrambleEyebrow>{data.eyebrow}</ScrambleEyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            {heading.lead}
            {heading.mutedTail && (
              <>
                {" "}
                <span className="text-muted">{heading.mutedTail}</span>
              </>
            )}
          </h2>
          <p className="mt-4 text-base text-muted leading-relaxed">{data.body}</p>
        </motion.div>

        <motion.figure
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          custom={1}
          variants={fadeInUp}
          className="rounded-2xl bg-[#0f0f0f] p-6 text-[#f5f5f0] sm:p-8"
        >
          <AiChatDemo
            question={data.question}
            answerLead={data.answerLead}
            answerCitation={data.answerCitation}
            answerTrail={data.answerTrail}
            credentials={data.credentials}
          />

          <div className="mt-6 border-t border-white/[0.06] pt-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
              {data.signalsLabel}
            </p>
            <ul className="mt-4 space-y-3">
              {data.signals.map((signal, i) => {
                const Icon = signal.icon;
                return (
                  <motion.li
                    key={signal.label}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-30px" }}
                    variants={fadeInUp}
                    className="flex items-center gap-3"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                      <Icon className="size-3.5 text-white/70" />
                    </span>
                    <span className="text-sm text-white/70">{signal.label}</span>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </motion.figure>
      </div>
    </Container>
  );
}
