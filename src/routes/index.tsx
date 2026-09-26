import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ChangeEvent, type CSSProperties, type DragEvent, type PointerEvent } from "react";
import { ImagePlus, RotateCcw, Target, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import defaultPhoto from "@/assets/tomato-target.png.asset.json";

type Hit = { id: number; x: number; y: number; rotation: number };
type Throw = { id: number; x: number; y: number };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tomato Toss — Take Your Best Shot" },
      { name: "description", content: "Upload a picture, take aim, and throw tomatoes. A tiny carnival game for big feelings." },
      { property: "og:title", content: "Tomato Toss — Take Your Best Shot" },
      { property: "og:description", content: "Upload a picture, take aim, and throw tomatoes. A tiny carnival game for big feelings." },
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
  const [photo, setPhoto] = useState(defaultPhoto.url);
  const [photoName, setPhotoName] = useState("THE ORIGINAL");
  const [hits, setHits] = useState<Hit[]>([]);
  const [throwing, setThrowing] = useState<Throw | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hitShake, setHitShake] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const objectUrl = useRef<string | null>(null);
  const photoArea = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  useEffect(() => () => { if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); }, []);

  const loadPhoto = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    const url = URL.createObjectURL(file);
    objectUrl.current = url;
    setPhoto(url);
    setPhotoName(file.name.replace(/\.[^.]+$/, "").slice(0, 30).toUpperCase());
    setHits([]);
    setThrowing(null);
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    loadPhoto(event.target.files?.[0]);
    event.target.value = "";
  };

  const toss = (x: number, y: number) => {
    const area = photoArea.current;
    if (!area) return;
    const id = ++nextId.current;
    setHits(current => [...current, { id, x, y, rotation: Math.round(Math.random() * 360) }]);
    setThrowing({ id, x: (x / 100 - .5) * area.clientWidth, y: -(1 - y / 100) * area.clientHeight + 20 });
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

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    loadPhoto(event.dataTransfer.files[0]);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="ticket-stripes h-2 w-full" aria-hidden="true" />
      <div className="mx-auto max-w-[1400px] px-5 pb-10 pt-6 sm:px-9 lg:px-14 lg:pt-9">
        <header className="flex items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full border-2 border-highlight text-highlight" aria-hidden="true"><Target size={22} strokeWidth={2.5} /></span>
            <span className="font-display text-base uppercase sm:text-xl">Tomato Toss<span className="text-primary">.</span></span>
          </div>
          <span className="hidden text-xs font-bold uppercase tracking-[.16em] text-muted-foreground sm:block">The extremely unofficial stress reliever</span>
          <span className="text-xs font-bold uppercase text-highlight sm:hidden">Est. right now</span>
        </header>

        <div className="grid items-center gap-7 pt-8 lg:grid-cols-[minmax(230px,1fr)_minmax(360px,480px)_minmax(230px,1fr)] lg:gap-10 lg:pt-10">
          <section className="text-center lg:self-start lg:pt-20 lg:text-left">
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.2em] text-highlight"><span className="inline-block size-2 rounded-full bg-highlight" /> Step right up</p>
            <h1 className="font-display text-[clamp(2.65rem,5.3vw,5.8rem)] leading-[.98] uppercase">Take your<br className="hidden lg:block" /> best <span className="text-primary">shot.</span></h1>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground lg:mx-0 lg:mt-6 lg:text-base">One picture. Unlimited tomatoes. Absolutely no cleanup required.</p>
            <div className="mt-6 hidden h-px w-20 bg-highlight lg:block" />
            <p className="mt-5 hidden text-sm font-semibold text-foreground lg:block">Click anywhere on the picture to let one fly.</p>
          </section>

          <section className="mx-auto w-full max-w-[480px]" aria-label="Tomato throwing target">
            <div className="flex items-center justify-between border border-stage-border bg-stage px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[.16em] text-highlight">
              <span className="flex items-center gap-2"><Target size={15} /> Target No. 01</span>
              <span className="max-w-[45%] truncate text-right text-foreground">{photoName}</span>
            </div>
            <div className="relative border-x-[8px] border-stage-border bg-stage sm:border-x-[10px]">
              <div
                ref={photoArea}
                role="button"
                tabIndex={0}
                aria-label="Throw a tomato at the picture"
                onPointerDown={handleToss}
                onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toss(50, 47); } }}
                onDragOver={event => { event.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative aspect-[.97] w-full cursor-crosshair touch-manipulation overflow-hidden outline-none focus-visible:ring-4 focus-visible:ring-ring sm:aspect-[.79] ${isDragging ? "ring-4 ring-inset ring-highlight" : ""} ${hitShake ? "portrait-hit" : ""}`}
              >
                <img src={photo} alt="Current tomato target" className="pointer-events-none h-full w-full select-none object-cover object-center" draggable={false} />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-foreground/15" />
                {hits.map(hit => <span key={hit.id} className="tomato-mark" style={{ left: `${hit.x}%`, top: `${hit.y}%`, "--rotation": `${hit.rotation}deg` } as CSSProperties}><Splat /></span>)}
                {throwing && <span className="throw-tomato" aria-hidden="true" style={{ "--throw-x": `${throwing.x}px`, "--throw-y": `${throwing.y}px` } as CSSProperties}>🍅</span>}
                {isDragging && <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-stage/80 font-display text-2xl uppercase text-highlight">Drop your picture</div>}
              </div>
            </div>
            <div className="flex items-center justify-between border border-stage-border bg-stage px-4 py-3 text-[11px] font-extrabold uppercase tracking-[.16em] text-muted-foreground">
              <span>← Aim anywhere →</span><span className="hidden text-highlight sm:block">No refunds, only tomatoes</span><span className="text-highlight sm:hidden">Take your shot</span>
            </div>
          </section>

          <aside className="mx-auto flex w-full max-w-[480px] flex-col gap-5 lg:self-center lg:pl-3">
            <div className="grid grid-cols-[1fr_auto] items-end border-b border-border pb-5 lg:block lg:pb-7">
              <div>
                <p className="mb-1 text-xs font-extrabold uppercase tracking-[.18em] text-muted-foreground">Tomatoes thrown</p>
                <p className="font-display text-6xl leading-none tabular-nums text-highlight lg:mt-3 lg:text-8xl" aria-live="polite">{String(hits.length).padStart(2, "0")}</p>
              </div>
              <span className="w-9 pb-1 lg:mt-4 lg:block" aria-hidden="true"><Splat /></span>
            </div>
            <div className="flex gap-3 lg:flex-col">
              <Button variant="tomato" size="lg" className="h-12 min-w-0 flex-1 rounded-sm px-4 text-xs sm:text-sm lg:w-full" onClick={() => fileInput.current?.click()}><ImagePlus /> Change picture</Button>
              <Button variant="utility" size="lg" className="h-12 min-w-0 flex-1 rounded-sm px-3 text-xs sm:text-sm lg:w-full" onClick={() => setHits([])} disabled={hits.length === 0}><RotateCcw /> Start over</Button>
            </div>
            <input ref={fileInput} type="file" accept="image/*" onChange={onFileChange} className="hidden" aria-label="Choose a picture" />
            <p className="hidden items-center gap-2 text-xs text-muted-foreground lg:flex"><Upload size={14} /> Or drop a photo right on the target.</p>
          </aside>
        </div>

        <footer className="mt-10 flex items-center justify-between border-t border-border pt-4 text-[10px] font-bold uppercase tracking-[.14em] text-muted-foreground lg:mt-14">
          <span>Made for a little harmless fun</span><span>Take aim, feel better</span>
        </footer>
      </div>
    </main>
  );
}