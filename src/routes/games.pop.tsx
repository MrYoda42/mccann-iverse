import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShopHeader } from "@/components/ShopHeader";
import portrait from "@/assets/tomato-target.png.asset.json";

export const Route = createFileRoute("/games/pop")({
  head: () => ({ meta: [
    { title: "McCann Pop — Mini McCann Games" },
    { name: "description", content: "Catch the popping McCann portrait before the timer runs out." },
    { property: "og:title", content: "McCann Pop — Mini McCann Games" },
    { property: "og:description", content: "Catch the popping McCann portrait before the timer runs out." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Pop,
});

function Pop() {
  const [seconds, setSeconds] = useState(30);
  const [score, setScore] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const clock = setInterval(() => setSeconds(t => Math.max(0, t - 1)), 1000);
    const pop = setInterval(() => setActive(previous => {
      const next = Math.floor(Math.random() * 8);
      return next >= previous! ? next + 1 : next;
    }), 850);
    return () => { clearInterval(clock); clearInterval(pop); };
  }, [playing]);
  useEffect(() => { if (seconds === 0) { setPlaying(false); setActive(null); } }, [seconds]);
  const navigate = useNavigate();
  useEffect(() => {
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      typed = (typed + e.key).slice(-4);
      if (typed === "6767") navigate({ to: "/secret" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const start = () => { setSeconds(30); setScore(0); setActive(Math.floor(Math.random() * 9)); setStarted(true); setPlaying(true); };
  const catchMcCann = (index: number) => {
    if (!playing || index !== active) return;
    setScore(s => s + 1);
    setActive(previous => { const next = Math.floor(Math.random() * 8); return next >= previous! ? next + 1 : next; });
  };

  return <main className="min-h-screen bg-background text-foreground"><ShopHeader />
    <div className="mx-auto max-w-2xl px-5 py-8 sm:px-9">
      <Link to="/games" className="inline-flex items-center gap-2 text-xs font-bold uppercase text-highlight hover:text-foreground"><ArrowLeft size={15} /> All games</Link>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-display text-3xl uppercase sm:text-5xl">McCann <span className="text-primary">Pop.</span></h1><p className="mt-2 text-sm text-muted-foreground">Catch him while you can.</p></div>
        <Button type="button" variant="tomato" onClick={start} className="rounded-sm"><RotateCcw /> {playing ? "Restart" : started ? "Play again" : "Start game"}</Button>
      </div>
      <div className="my-6 flex justify-between border-y border-border py-3 text-xs font-bold uppercase tracking-[.15em] text-highlight"><span>Score {score}</span><span aria-live="off">Time {seconds}s</span></div>
      {started && !playing && <div role="status" className="mb-5 border border-highlight bg-stage p-4 text-center font-display text-lg uppercase text-highlight">Time! You caught {score}.</div>}
      <div className="grid grid-cols-3 gap-2 sm:gap-3" aria-label="McCann Pop board">
        {Array.from({ length: 9 }, (_, index) => <Button key={index} type="button" variant="utility" onClick={() => catchMcCann(index)} aria-label={active === index ? "Catch McCann" : `Empty spot ${index + 1}`} className={`relative aspect-square h-auto w-full overflow-hidden rounded-sm border-stage-border bg-stage p-0 ${active === index ? "border-highlight" : ""}`}>
          {playing && active === index && <img src={portrait.url} alt="" draggable={false} className="h-full w-full select-none object-cover object-[center_28%]" />}
        </Button>)}
      </div>
    </div>
  </main>;
}