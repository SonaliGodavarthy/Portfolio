"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ChatCircleDots, PaperPlaneRight, X } from "@phosphor-icons/react";

const SPRING = { type: "spring", bounce: 0, duration: 0.4 } as const;
const MAX_CHARS = 1000;

interface Turn {
  role: "user" | "assistant";
  text: string;
}

const SUGGESTIONS = [
  "What is Sonali working on now?",
  "Tell me about her ICPR 2026 paper.",
  "What has she built with RAG?",
];

/** A floating assistant that answers questions from knowledge_base.md. */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Keep the newest text in view while an answer streams in.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns]);

  const ask = async (question: string) => {
    const q = question.trim().slice(0, MAX_CHARS);
    if (!q || busy) return;
    const history: Turn[] = [...turns, { role: "user", text: q }];
    setTurns([...history, { role: "assistant", text: "" }]);
    setInput("");
    setBusy(true);

    const write = (text: string) =>
      setTurns((t) => [...t.slice(0, -1), { role: "assistant", text }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Only the most recent turns go to the server, and no empty replies.
        body: JSON.stringify({ messages: history.filter((t) => t.text).slice(-20) }),
      });
      if (!res.ok || !res.body) {
        write((await res.text().catch(() => "")) || "Something went wrong. Please try again.");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        write(text);
      }
      if (!text) write("I couldn’t come up with an answer. Please try rephrasing.");
    } catch {
      write("I can’t reach the assistant right now. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-[70] md:bottom-6 md:right-6">
      <AnimatePresence>
        {open && (
          <motion.section
            id="chat-panel"
            role="dialog"
            aria-label="Ask about Sonali"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97, transition: { duration: 0.15 } }}
            transition={SPRING}
            style={{ transformOrigin: "bottom right" }}
            className="material-dark absolute bottom-16 right-0 flex h-[min(34rem,calc(100svh-7rem))] w-[min(24rem,calc(100vw-2rem))]
                       flex-col overflow-hidden rounded-3xl ring-1 ring-line"
          >
            <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
              <div>
                <h2 className="font-display text-[1rem] font-semibold tracking-[-0.01em] text-ink">Ask About Sonali</h2>
                <p className="text-[0.75rem] text-ink-3">Answers come from this website only.</p>
              </div>
              <button
                type="button"
                aria-label="Close chat"
                onClick={() => {
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
                className="grid size-9 place-items-center rounded-full text-ink-2 hover:bg-ink/10 hover:text-ink active:bg-ink/15"
              >
                <X size={16} weight="bold" aria-hidden />
              </button>
            </header>

            <div ref={listRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-5 py-4">
              {turns.length === 0 ? (
                <div>
                  <p className="text-[0.9375rem] leading-[1.55] text-ink-2">
                    Hi! Ask me about Sonali’s research, experience, projects or how to reach her.
                  </p>
                  <ul className="mt-4 space-y-2">
                    {SUGGESTIONS.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          onClick={() => ask(s)}
                          className="w-full rounded-xl bg-ink/[0.06] px-3.5 py-2.5 text-left text-[0.875rem] text-ink
                                     transition-colors duration-150 hover:bg-ink/10 active:bg-ink/15"
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                turns.map((t, i) =>
                  t.role === "user" ? (
                    <p
                      key={i}
                      className="ml-auto w-fit max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-lavender px-3.5 py-2
                                 text-[0.9375rem] leading-[1.5] text-[#140f26]"
                    >
                      {t.text}
                    </p>
                  ) : (
                    <div key={i} className="max-w-[92%] text-[0.9375rem] leading-[1.6] text-ink">
                      {t.text ? <RichText text={t.text} /> : <Typing />}
                    </div>
                  ),
                )
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-end gap-2 border-t border-line p-3"
            >
              <label htmlFor="chat-input" className="sr-only">
                Your question
              </label>
              <textarea
                id="chat-input"
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={MAX_CHARS}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    ask(input);
                  }
                }}
                placeholder="Ask a question…"
                className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl bg-paper/60 px-4 py-2.5 text-[1rem] text-ink
                           placeholder:text-ink-3 ring-1 ring-line focus:outline-none focus:ring-lavender"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={busy || !input.trim()}
                className="grid size-11 shrink-0 place-items-center rounded-full bg-lavender text-[#140f26]
                           transition-[background-color,transform,opacity] duration-150 hover:bg-white active:scale-[0.95]
                           disabled:opacity-40 disabled:hover:bg-lavender"
              >
                <PaperPlaneRight size={18} weight="fill" aria-hidden />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Close chat" : "Ask about Sonali"}
        aria-expanded={open}
        aria-controls="chat-panel"
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.94 }}
        transition={SPRING}
        className="grid size-14 place-items-center rounded-full bg-lavender text-[#140f26]
                   shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_14px_30px_-12px_rgba(5,3,12,0.9)]
                   transition-colors duration-150 hover:bg-white"
      >
        {open ? <X size={22} weight="bold" aria-hidden /> : <ChatCircleDots size={26} weight="fill" aria-hidden />}
      </motion.button>
    </div>
  );
}

function Typing() {
  return (
    <span className="inline-flex gap-1 py-2" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-ink-3"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

// Minimal, safe Markdown: paragraphs, "- " lists, **bold** and [links](url).
const INLINE = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(((?:https?:\/\/|mailto:|\/)[^)\s]+)\)/g;

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) {
      out.push(<strong key={m.index} className="font-semibold">{m[1]}</strong>);
    } else {
      const href = m[3];
      const cls = "font-medium text-lavender underline underline-offset-2 hover:text-white";
      out.push(
        href.startsWith("/") ? (
          <Link key={m.index} href={href} className={cls}>{m[2]}</Link>
        ) : (
          <a key={m.index} href={href} target="_blank" rel="noopener noreferrer" className={cls}>{m[2]}</a>
        ),
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function RichText({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <div className="space-y-2.5">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (lines.every((l) => /^\s*[-*] /.test(l))) {
          return (
            <ul key={i} className="space-y-1.5">
              {lines.map((l, j) => (
                <li key={j} className="relative pl-4">
                  <span className="absolute left-0 top-[0.75em] h-px w-2 bg-lavender" aria-hidden />
                  {inline(l.replace(/^\s*[-*] /, ""))}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="break-words">
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(l)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
