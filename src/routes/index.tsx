import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { RotateCcw, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import defaultPhoto from "@/assets/tomato-target.png.asset.json";

const fruits = [
  { id: "tomato", label: "Tomato" },
  { id: "orange", label: "Orange" },
  { id: "lemon", label: "Lemon" },
  { id: "strawberry", label: "Berry" },
] as const;
type FruitId = typeof fruits[number]["id"];
type Hit = { id: number; x: number; y: number; rotation: number; fruit: FruitId };
type Throw = { id: number; x: number; y: number; fruit: FruitId };

function FruitIcon({ fruit }: { fruit: FruitId }) {
  return (
    <svg viewBox="0 0 48 48" className={`fruit-icon fruit-${fruit}`} aria-hidden="true">
      {fruit === "lemon" ? <path className="fruit-body" d="M7 26c-2-2-2-6 1-8 5-3 7-9 19-9 11 0 15 6 16 13 1 8-5 16-17 17-8 1-15-2-18-8-1-2-3-2-1-5z" /> : fruit === "strawberry" ? <path className="fruit-body" d="M24 12C14 7 7 15 10 25c3 10 11 18 14 19 4-1 12-9 15-19 3-10-5-18-15-13z" /> : <path className="fruit-body" d="M24 10c12 0 20 8 20 19 0 10-9 16-20 16S4 39 4 29C4 18 12 10 24 10z" />}
      {fruit === "tomato" && <path className="fruit-leaf" d="M23 4l2 8 8-4-3 7 9 1-9 3-5 6-4-7-10 1 7-6-6-5 9 3z" />}
      {fruit === "orange" && <><path className="fruit-leaf" d="M25 11c2-8 9-9 14-6-2 6-7 9-14 9z" /><path className="fruit-detail" d="M24 13v-5" /></>}
      {fruit === "lemon" && <path className="fruit-detail" d="M13 29c2 4 5 6 9 6" />}
      {fruit === "strawberry" && <><path className="fruit-leaf" d="M24 15c-5-5-10-4-15-2l7 5-2 5 10-4 10 4-2-5 7-5c-6-2-10-3-15 2z" /><path className="fruit-detail" d="M24 13V6" /><circle className="fruit-seed" cx="19" cy="27" r="1.2" /><circle className="fruit-seed" cx="29" cy="27" r="1.2" /><circle className="fruit-seed" cx="24" cy="34" r="1.2" /></>}
      <path className="fruit-shine" d="M12 22c2-5 5-7 9-8" />
    </svg>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tomato Toss — Take Your Best Shot" },
      { name: "description", content: "Pick a fruit, take aim, and knock down the health bar in this playful carnival game." },
      { property: "og:title", content: "Tomato Toss — Take Your Best Shot" },
      { property: "og:description", content: "Pick a fruit, take aim, and knock down the health bar in this playful carnival game." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Splat() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <path fill="var(--color-primary)" d="M59 14c5-2 8-13 13-12 6 1 1 16 6 19 5 3 17-12 23-7 6 5-7 16-5 23 2 5 19 2 21 9 2 7-16 8-17 14-1 7 18 13 14 20-4 8-21-2-26 2-5 4 1 21-6 23-8 2-14-14-21-13-7 1-12 20-20 18-8-2-4-19-9-23-5-4-20 7-24 0-4-7 11-17 10-24-1-7-19-10-17-18 2-8 19-5 22-11 3-6-8-18-2-23 6-5 17 7 23 5 6-2 8-17 15-17z" />
      <circle fill="var(--color-primary)" cx="8" cy="25" r="5" /><circle fill="var(--color-primary)" cx="107" cy="8" r="4" /><circle fill="var(--color-primary)" cx="113" cy="104" r="6" /><circle fill="var(--color-primary)" cx="9" cy="105" r="3" />
      <path fill="var(--color-destructive)" d="M36 48c9-18 40-23 53-5 10 14 3 36-12 44-14 8-37 1-44-13-4-9-3-18 3-26z" />
      <path fill="var(--color-highlight)" d="M39 48c7-11 18-14 25-13-8 4-15 10-18 18z" opacity=".52" />
      <circle fill="var(--color-primary)" cx="30" cy="119" r="3" />
    </svg>
  );
}

function Index() {
  const [hits, setHits] = useState<Hit[]>([]);
  const [selectedFruit, setSelectedFruit] = useState<FruitId>("tomato");
  const [throwing, setThrowing] = useState<Throw | null>(null);
  const [hitShake, setHitShake] = useState(false);
  const photoArea = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const health = Math.max(0, 100 - hits.length * 10);

  const toss = (x: number, y: number) => {
    const area = photoArea.current;
    if (!area || health === 0) return;
    const id = ++nextId.current;
    setHits(current => [...current, { id, x, y, rotation: Math.round(Math.random() * 360), fruit: selectedFruit }]);
    setThrowing({ id, x: (x / 100 - .5) * area.clientWidth, y: -(1 - y / 100) * area.clientHeight + 20, fruit: selectedFruit });
    setHitShake(true);
    window.setTimeout(() => setThrowing(current => current?.id === id ? null : current), 430);
    window.setTimeout(() => setHitShake(false), 300);
  };

  const handleToss = (event: PointerEvent<HTMLDivElement>) => {
    const area = photoArea.current;
    if (!area) return;
    const bounds = area.getBoundingClientRect();
    toss(Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100)), Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100)));
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="ticket-stripes h-2 w-full" aria-hidden="true" />
      <div className="mx-auto max-w-[1400px] px-5 pb-10 pt-6 sm:px-9 lg:px-14 lg:pt-9">
        <header className="flex items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full border-2 border-highlight text-highlight" aria-hidden="true"><Target size={22} strokeWidth={2.5} /></span>
            <span className="font-display text-base uppercase sm:text-xl">Fruit Toss<span className="text-primary">.</span></span>
          </div>
          
          <Link to="/shop" className="text-xs font-bold uppercase tracking-[.14em] text-highlight">Shop Mini McCanns →</Link>
        </header>

        <div className="grid items-center gap-7 pt-8 lg:grid-cols-[minmax(230px,1fr)_minmax(360px,480px)_minmax(230px,1fr)] lg:gap-10 lg:pt-10">
          <section className="text-center lg:self-start lg:pt-20 lg:text-left">
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.2em] text-highlight"><span className="inline-block size-2 rounded-full bg-highlight" /> Step right up</p>
            <h1 className="font-display text-[clamp(2.65rem,5.3vw,5.8rem)] leading-[.98] uppercase">Take your<br className="hidden lg:block" /> best <span className="text-primary">shot.</span></h1>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground lg:mx-0 lg:mt-6 lg:text-base">One picture. Four fruits. Absolutely no cleanup required.</p>
            <div className="mt-6 hidden h-px w-20 bg-highlight lg:block" />
            <p className="mt-5 hidden text-sm font-semibold text-foreground lg:block">Pick a fruit, then click anywhere on the picture.</p>
          </section>

          <section className="mx-auto w-full max-w-[480px]" aria-label="Tomato throwing target">
            <div className="flex items-center justify-between border border-stage-border bg-stage px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[.16em] text-highlight">
              <span className="flex items-center gap-2"><Target size={15} /> Target No. 01</span>
              <span className="max-w-[45%] truncate text-right text-foreground">THE ORIGINAL</span>
            </div>
            <div className="flex items-center justify-between gap-3 border-x border-stage-border bg-stage px-4 py-2 text-[11px] font-extrabold uppercase tracking-[.12em] text-foreground">
              <span className="shrink-0 text-highlight">Health</span>
              <div className="h-3 flex-1 overflow-hidden border border-border bg-muted" role="progressbar" aria-label="Target health" aria-valuenow={health} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${health}%` }} />
              </div>
              <span className="w-9 text-right tabular-nums">{health}%</span>
            </div>
            <div className="relative border-x-[8px] border-stage-border bg-stage sm:border-x-[10px]">
              <div
                ref={photoArea}
                role="button"
                tabIndex={0}
                aria-label={`Throw a ${selectedFruit} at the picture`}
                onPointerDown={handleToss}
                onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toss(50, 47); } }}
                className={`relative aspect-[.97] w-full touch-manipulation overflow-hidden outline-none focus-visible:ring-4 focus-visible:ring-ring sm:aspect-[.79] ${health === 0 ? "cursor-default" : "cursor-crosshair"} ${hitShake ? "portrait-hit" : ""}`}
              >
                <img src={defaultPhoto.url} alt="Fruit toss target" className="pointer-events-none h-full w-full select-none object-cover object-center" draggable={false} />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-foreground/15" />
                {hits.map(hit => <span key={hit.id} className={`tomato-mark splat-${hit.fruit}`} style={{ left: `${hit.x}%`, top: `${hit.y}%`, "--rotation": `${hit.rotation}deg` } as CSSProperties}><Splat /></span>)}
                {throwing && <span className="throw-tomato" aria-hidden="true" style={{ "--throw-x": `${throwing.x}px`, "--throw-y": `${throwing.y}px` } as CSSProperties}><FruitIcon fruit={throwing.fruit} /></span>}
                {health === 0 && <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-stage/60"><span className="-rotate-6 border-4 border-highlight bg-stage px-5 py-3 font-display text-3xl uppercase text-highlight shadow-lg sm:text-5xl">Knockout!</span></div>}
              </div>
            </div>
            <div className="flex items-center justify-between border border-stage-border bg-stage px-4 py-3 text-[11px] font-extrabold uppercase tracking-[.16em] text-muted-foreground">
              <span>← Aim anywhere →</span><span className="text-highlight">{health === 0 ? "Game over" : "Take your shot"}</span>
            </div>
          </section>

          <aside className="mx-auto flex w-full max-w-[480px] flex-col gap-5 lg:self-center lg:pl-3">
            <div className="grid grid-cols-[1fr_auto] items-end border-b border-border pb-5 lg:block lg:pb-7">
              <div>
                <p className="mb-1 text-xs font-extrabold uppercase tracking-[.18em] text-muted-foreground">Fruits thrown</p>
                <p className="font-display text-6xl leading-none tabular-nums text-highlight lg:mt-3 lg:text-8xl" aria-live="polite">{String(hits.length).padStart(2, "0")}</p>
              </div>
              <span className="w-9 pb-1 lg:mt-4 lg:block" aria-hidden="true"><FruitIcon fruit={selectedFruit} /></span>
            </div>
            <div>
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[.18em] text-muted-foreground">Choose your fruit</p>
              <div className="grid grid-cols-4 gap-2">
                {fruits.map(fruit => <Button key={fruit.id} type="button" variant={selectedFruit === fruit.id ? "tomato" : "utility"} aria-pressed={selectedFruit === fruit.id} aria-label={fruit.label} title={fruit.label} onClick={() => setSelectedFruit(fruit.id)} className="flex h-[66px] min-w-0 flex-col gap-0.5 rounded-sm px-1 text-[10px] font-bold uppercase sm:h-[72px]"><span className="size-7" aria-hidden="true"><FruitIcon fruit={fruit.id} /></span>{fruit.label}</Button>)}
              </div>
            </div>
            <Button variant="utility" size="lg" className="h-12 w-full rounded-sm px-3 text-sm" onClick={() => { setHits([]); setThrowing(null); }} disabled={hits.length === 0}><RotateCcw /> Start over</Button>
          </aside>
        </div>

        <footer className="mt-10 flex items-center justify-between border-t border-border pt-4 text-[10px] font-bold uppercase tracking-[.14em] text-muted-foreground lg:mt-14">
          <span>Made for a little harmless fun</span><span>Take aim, feel better</span>
        </footer>
      </div>
    </main>
  );
}