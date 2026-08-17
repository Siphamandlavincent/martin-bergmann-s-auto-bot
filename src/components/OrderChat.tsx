import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageSquare, Send, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { chatWithBot } from "@/lib/store.functions";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi, I'm Bergie from Martin Bergmann. Tell me your vehicle and the part you need and I'll quote you and place the order right here.",
};

/** Renders the light markdown (**bold**) the assistant uses, without a parser. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((chunk, index) =>
        chunk.startsWith("**") && chunk.endsWith("**") ? (
          <strong key={index}>{chunk.slice(2, -2)}</strong>
        ) : (
          <span key={index}>{chunk.replace(/^\s*\*\s+/gm, "• ")}</span>
        ),
      )}
    </>
  );
}


export function OrderChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const send = useServerFn(chatWithBot);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function submit() {
    const text = input.trim();
    if (!text || busy) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const result = await send({
        data: { messages: next.filter((m) => m !== GREETING).slice(-20) },
      });
      setMessages([...next, { role: "assistant", content: result.reply }]);
      if (result.orderPlaced) {
        toast.success(`Order ${result.orderReference} sent to the store`);
      }
    } catch (error) {
      toast.error((error as Error).message || "The assistant is unavailable right now.");
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't reach the parts system just now. Please call the store and we'll help you straight away.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button
        size="lg"
        onClick={() => setOpen((value) => !value)}
        className="fixed right-5 bottom-5 z-50 shadow-glow"
        aria-label={open ? "Close order chat" : "Open order chat"}
      >
        {open ? <X /> : <MessageSquare />}
        {open ? "Close" : "Order via chat"}
      </Button>

      {open && (
        <section
          aria-label="Order assistant"
          className="fixed right-5 bottom-24 z-50 flex h-[32rem] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-lg border-2 border-ink bg-card shadow-hard"
        >
          <header className="bg-ink px-4 py-3 text-ink-foreground">
            <p className="font-display text-sm">Bergie · Parts &amp; Orders</p>
            <p className="text-xs opacity-70">Quotes, fitment and orders in one chat</p>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "max-w-[85%] text-sm whitespace-pre-wrap",
                  message.role === "user"
                    ? "ml-auto rounded-lg bg-primary px-3 py-2 text-primary-foreground"
                    : "text-foreground",
                )}
              >
                {message.content}
              </div>
            ))}
            {busy && <p className="animate-pulse text-sm text-muted-foreground">Checking stock…</p>}
          </div>

          <div className="flex items-end gap-2 border-t p-3">
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void submit();
                }
              }}
              rows={2}
              placeholder="e.g. Front brake pads for a 2015 Polo 1.4"
              className="min-h-0 resize-none"
              aria-label="Message the order assistant"
            />
            <Button size="icon" onClick={() => void submit()} disabled={busy} aria-label="Send">
              <Send />
            </Button>
          </div>
        </section>
      )}
    </>
  );
}
